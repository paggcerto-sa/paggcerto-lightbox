import Currency from './util/currency'
import Environment from './sdk/environment'

class LightboxOptions {
  constructor(options) {
    this._options = options
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
    if (!this._isString(this._options.environment)) throw new Error('Invalid options.environment: Expected String.')
    if (this._options.environment !== Environment.Sandbox && this._options.environment !== Environment.Production)
      throw new Error('Invalid options.environment: Expected "sandbox" or "production".')
    if (!this._isString(this._options.token)) throw new Error('Invalid options.token: Expected String.')
    if (!this._isObject(this._options.payment)) throw new Error('Invalid options.payment: Expected Object.')
    if (!this._isNullOrUndefined(this._options.payment.amount))
      if (!this._isNumber(this._options.payment.amount)) throw new Error('Invalid options.payment.amount: Expected Number.')
    if (!this._isBoolean(this._options.payment.replicateAmount)) throw new Error('Invalid options.payment.replicateAmount: Expected Boolean.')
    if (!this._isBoolean(this._options.payment.bankSlipEnabled)) throw new Error('Invalid options.payment.bankSlipEnabled: Expected Boolean.')
    if (!this._isBoolean(this._options.payment.creditEnabled)) throw new Error('Invalid options.payment.creditEnabled: Expected Boolean.')
    if (!this._isBoolean(this._options.payment.debitEnabled)) throw new Error('Invalid options.payment.debitEnabled: Expected Boolean.')
    if (!this._isArray(this._options.payment.payers)) throw new Error('Invalid options.payment.payers: Expected Array.')

    this._options.payment.payers.forEach((payer, index) => {
      if (!this._isObject(payer)) throw new Error(`Invalid options.payment.payers[${index}]: Expected Object.`)
      if (!this._isNullOrUndefined(payer.sellingKey))
        if (!this._isString(payer.sellingKey)) throw new Error(`Invalid options.payment.payers[${index}].sellingKey: Expected String.`)
      if (!this._isString(payer.fullName)) throw new Error(`Invalid options.payment.payers[${index}].name: Expected String.`)
      if (!this._isString(payer.taxDocument)) throw new Error(`Invalid options.payment.payers[${index}].taxDocument: Expected String.`)
      if (!this._isString(payer.mobile)) throw new Error(`Invalid options.payment.payers[${index}].mobile: Expected String.`)
      if (!this._isString(payer.email)) throw new Error(`Invalid options.payment.payers[${index}].email: Expected String.`)
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
    this._options.payment.bankSlip = null
    this._options.payment.card = null
    this._options.payment.amountText = new Currency(this._options.payment.amount).asString()
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
