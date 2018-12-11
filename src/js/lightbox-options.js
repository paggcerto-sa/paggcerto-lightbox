import Currency from './util/currency'
import Environment from './sdk/environment'
import TaxDocument from './util/taxdocument'
import Email from './util/email'
import Phone from './util/phone'
import { PaymentLimit } from './constants'

class LightboxOptions {
  constructor(options) {
    this._options = options
    this._options.errors = []
  }

  _isArray(value) {
    return value instanceof Array
  }

  _isBoolean(value) {
    return typeof value === 'boolean'
  }

  _isNullOrUndefined(value) {
    return value === undefined || value === null
  }

  _isNumber(value) {
    return typeof value === 'number'
  }

  _isNumberPositive(value) {
    var isNumber = this._isNumber(value)
    if (!isNumber) return false

    var _isNumberPositive = value <= 0
    return !_isNumberPositive && isNumber
  }

  _isObject(value) {
    return typeof value === 'object'
  }

  _isString(value) {
    return typeof value === 'string'
  }

  _isFunction(value) {
    return typeof value === 'function'
  }

  _validate() {
    if (!this._isObject(this._options)) throw new Error('Invalid options: Expected Object.')
    if (!this._isString(this._options.environment)) this._options.errors.push({ "message": "O campo de configuração de ambiente está invalido." })
    if (this._options.environment !== Environment.Sandbox && this._options.environment !== Environment.Production) {
      this._options.errors.push({ "message": "O ambiente que está rodando não é homolgado pela paggcerto."})
    }
    if (!this._isString(this._options.token)) throw new Error('Invalid options.token: Expected String.')
    if (!this._isObject(this._options.payment)) throw new Error('Invalid options.payment: Expected Object.')
    if (!this._isNullOrUndefined(this._options.payment.amount))
      if (!this._isNumber(this._options.payment.amount)) this._options.errors.push({ "message": "O valor do pagamento não é numérico." })
    if (!this._isBoolean(this._options.payment.replicateAmount)) this._options.errors.push({ "message": "O campo de configuração do mudança de valor está inválido." })
    if (!this._isBoolean(this._options.payment.bankSlipEnabled)) this._options.errors.push({ "message": "O campo para habilitar a venda com boleto está inválido." })
    if (!this._isBoolean(this._options.payment.creditEnabled)) this._options.errors.push({ "message": "O campo para habilitar a venda com cartão de crédito está inválido." })
    if (!this._isBoolean(this._options.payment.debitEnabled)) this._options.errors.push({ "message": "O campo para habilitar a venda com cartão de débito está inválido." })
    if (!this._isArray(this._options.payment.payers)) throw new Error('Invalid options.payment.payers: Expected Array.')
    if (!this._isBoolean(this._options.payment.deviceEnabled) && !this._isNullOrUndefined(this._options.payment.deviceEnabled)) throw new Error("Invalid options.payment.deviceEnabled: Expected Boolean.");
    if (!this._isNullOrUndefined(this._options.payment.card)) {
      if (!this._isNullOrUndefined(this._options.payment.card.installments) && !this._isNumberPositive(this._options.payment.card.installments)) {
         this._options.errors.push({ "message": `A quantidade de parcelas deve ser positiva`})
      }
      if (this._options.payment.card.installments > PaymentLimit.CREDIT_INSTALLMENTS_MAXIMUM) {
        this._options.errors.push({ "message": `Quantidade maxima de parcelas é ${ PaymentLimit.CREDIT_INSTALLMENTS_MAXIMUM }.`})
      }
    }

    this._options.payment.payers.forEach((payer, index) => {
      if (!this._isObject(payer)) throw new Error(`Invalid options.payment.payers[${index}]: Expected Object.`)
      if (!this._isNullOrUndefined(payer.sellingKey))
        if (!this._isString(payer.sellingKey)) throw new Error(`Invalid options.payment.payers[${index}].sellingKey: Expected String.`)
      if (!this._isString(payer.fullName)) this._options.errors.push({ "message": `O nome do pagador do indice ${index} está inválido.` })
      if (!this._isString(payer.taxDocument)) throw new Error(`Invalid options.payment.payers[${index}].taxDocument: Expected String.`)
      if (!new TaxDocument(payer.taxDocument).isValid()) this._options.errors.push({ "message": `O documento do pagador ${payer.fullName} está inválido.` })
      if (!this._isNullOrUndefined(payer.mobile) && !this._isString(payer.mobile)) throw new Error(`Invalid options.payment.payers[${index}].mobile: Expected String.`)
      if (!this._isNullOrUndefined(payer.email) && !this._isString(payer.email)) throw new Error(`Invalid options.payment.payers[${index}].mobile: Expected String.`)
      if (!this._isNullOrUndefined(payer.email)) {
        if (!new Email(payer.email).isValid()) this._options.errors.push({ "message": `O email do pagador ${payer.fullName} está inválido.` })
      }

      if (!this._isNullOrUndefined(payer.mobile)) {
        if (!new Phone(payer.mobile).isValid()) this._options.errors.push({ "message": `O celular do pagador ${payer.fullName} está inválido.` })
      }
    })

    if (!this._isNullOrUndefined(this._options.abort))
      if (!this._isFunction(this._options.abort)) throw new Error('Invalid options.abort: Expected Function.')
    if (!this._isNullOrUndefined(this._options.success))
      if (!this._isFunction(this._options.success)) throw new Error('Invalid options.success: Expected Function.')
    if (!this._isNullOrUndefined(this._options.fail))
      if (!this._isFunction(this._options.fail)) throw new Error('Invalid options.fail: Expected Function.')
  }

  _rewriteValues() {
    const hasAtLeastOnePayer = this._options.payment.payers.length > 0
    const haveAtMostOnePayer = this._options.payment.payers.length <= 1

    this._options.payment.bankSlipEnabled = this._options.payment.bankSlipEnabled && hasAtLeastOnePayer
    this._options.payment.creditEnabled = this._options.payment.creditEnabled && haveAtMostOnePayer
    this._options.payment.debitEnabled = this._options.payment.debitEnabled && haveAtMostOnePayer
  }

  _setDefaultValues() {
    this._options.payment = this._options.payment || {}
    this._options.payment.bankSlip = this._isNullOrUndefined(this._options.payment.bankSlip) ? null : this._options.payment.bankSlip
    this._options.payment.card = this._isNullOrUndefined(this._options.payment.card) ? null : this._options.payment.card
    this._options.payment.amountText = new Currency(this._options.payment.amount).asString()
    this._options.payment.deviceEnabled = this._isNullOrUndefined(this._options.payment.deviceEnabled) ? true : this._options.payment.deviceEnabled
  }

  _setHelperValues() {
    const bankSlipEnabled = this._options.payment.bankSlipEnabled
    const creditEnabled = this._options.payment.creditEnabled
    const debitEnabled = this._options.payment.debitEnabled

    this._options.payment.onlyBankSlipEnabled = bankSlipEnabled && !(creditEnabled || debitEnabled)
    this._options.payment.onlyCreditEnabled = creditEnabled && !(debitEnabled || bankSlipEnabled)
    this._options.payment.onlyDebitEnabled = debitEnabled && !(creditEnabled || bankSlipEnabled)
    this._options.payment.allMethodsDisabled = !(bankSlipEnabled || creditEnabled || debitEnabled)
    this._options.payment.amountEditable = this._isNullOrUndefined(this._options.payment.amount)
  }

  _setCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this._options.payment.geolocation = {
          latitude: position.coords.latitude.toFixed(7),
          longitude: position.coords.longitude.toFixed(7)
        }
      })
    }
  }

  asObject() {
    this._validate()
    this._rewriteValues();
    this._setDefaultValues()
    this._setHelperValues()
    this._setCurrentLocation()

    return this._options
  }
}

export default LightboxOptions
