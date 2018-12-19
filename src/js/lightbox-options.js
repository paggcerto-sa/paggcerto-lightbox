import Currency from './util/currency'
import Environment from './sdk/environment'
import TaxDocument from './util/taxdocument'
import Email from './util/email'
import Phone from './util/phone'
import { PaymentLimit } from './constants'
import DateDue from './util/dateDue'
import CalculateMaximumDiscount from './util/calculate-maximum-discount'

import {
  _isArray,
  _isBoolean,
  _isNullOrUndefined,
  _isNumber,
  _isNumberPositive,
  _isObject,
  _isString,
  _isFunction,
  _isNumberPositiveOrNeutral } from './util/annotations'

class LightboxOptions {
  constructor(options) {
    this._options = options
    this._options.errors = []
  }

  _validate() {
    this._validateEnvironment()
    this._validatePaymentConfig()
    this._validateBankSlip()
    this._validatePayers()
    this._validateCard()
    this._validateFunctionsCallBacks()
  }

  _rewriteValues() {
    if (_isNullOrUndefined(this._options.payment.payers) || !_isArray(this._options.payment.payers)) return
    const hasAtLeastOnePayer = this._options.payment.payers.length > 0
    const haveAtMostOnePayer = this._options.payment.payers.length <= 1

    this._options.payment.bankSlipEnabled = this._options.payment.bankSlipEnabled && hasAtLeastOnePayer
    this._options.payment.creditEnabled = this._options.payment.creditEnabled && haveAtMostOnePayer
    this._options.payment.debitEnabled = this._options.payment.debitEnabled && haveAtMostOnePayer
  }

  _setDefaultValues() {
    this._options.payment = this._options.payment || {}
    this._options.payment.bankSlip = _isNullOrUndefined(this._options.payment.bankSlip) ? null : this._options.payment.bankSlip
    this._options.payment.card = _isNullOrUndefined(this._options.payment.card) ? null : this._options.payment.card
    this._options.payment.amountText = new Currency(this._options.payment.amount).asString()
    this._options.payment.deviceEnabled = _isNullOrUndefined(this._options.payment.deviceEnabled) ? true : this._options.payment.deviceEnabled
  }

  _setHelperValues() {
    const bankSlipEnabled = this._options.payment.bankSlipEnabled
    const creditEnabled = this._options.payment.creditEnabled
    const debitEnabled = this._options.payment.debitEnabled

    this._options.payment.onlyBankSlipEnabled = bankSlipEnabled && !(creditEnabled || debitEnabled)
    this._options.payment.onlyCreditEnabled = creditEnabled && !(debitEnabled || bankSlipEnabled)
    this._options.payment.onlyDebitEnabled = debitEnabled && !(creditEnabled || bankSlipEnabled)
    this._options.payment.allMethodsDisabled = !(bankSlipEnabled || creditEnabled || debitEnabled)
    this._options.payment.amountEditable = _isNullOrUndefined(this._options.payment.amount)
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

  _validateCard() {
    if (_isNullOrUndefined(this._options.payment.card)) return
    if (!_isObject(this._options.payment.card)) {
      this._options.errors.push({ 'message': `O formato para configurar pagamento com cartão está invalido.` })
      return
    }
    if (!_isNullOrUndefined(this._options.payment.card)) {
      if (!_isNullOrUndefined(this._options.payment.card.installments) && !_isNumberPositive(this._options.payment.card.installments)) {
        this._options.errors.push({ 'message': `A quantidade de parcelas deve ser positiva` })
        return
      }
      else if (this._options.payment.card.installments > PaymentLimit.CREDIT_INSTALLMENTS_MAXIMUM) {
        this._options.errors.push({ 'message': `Quantidade máxima de parcelas é ${PaymentLimit.CREDIT_INSTALLMENTS_MAXIMUM}.` })
      }
    }
  }

  _validateBankSlip () {
    if (_isNullOrUndefined(this._options.payment.bankSlip)) return
    if (!_isObject(this._options.payment.bankSlip)) {
      this._options.errors.push({ 'message': `O formato para configurar pagamento com boleto está inválido.` })
      return
    }

    if (_isNullOrUndefined(this._options.payment.payers)) {
      this._options.errors.push({ 'message': `Não é possivel efetuar pagamento com boleto sem ter os pagadores.` })
      return
    }

    if (!_isNullOrUndefined(this._options.payment.bankSlip.dueDate)) {
      var dueDate = new DateDue(this._options.payment.bankSlip.dueDate)

      if (!dueDate.isValid()) {
        this._options.errors.push({ 'message': `O formato da data de vencimento do boleto está inválido ou o vencimento deve ser igual ou superior a data atual.` })
        return
      }
      if (dueDate._diffDays > PaymentLimit.MAX_DUE_DAYS) this._options.errors.push({ 'message': `O campo data de vencimento do boleto ultrapassou a quantidade máxima de dias permitido que é  ${PaymentLimit.MAX_DUE_DAYS}.` })
    }

    if (!_isBoolean(this._options.payment.bankSlip.avoidSteps) && !_isNullOrUndefined(this._options.payment.bankSlip.avoidSteps)) this._options.errors.push({ 'message': `O campo para habilitar geração de pdf do pagamento com boleto está no formato incorreto.` })

    if (_isNullOrUndefined(this._options.payment.bankSlip.avoidSteps)) {
      this._options.payment.bankSlip.avoidSteps = false
    }

    if (_isNullOrUndefined(this._options.payment.bankSlip.dueDate) || _isNullOrUndefined(this._options.payment.amount)
      && _isBoolean(this._options.payment.bankSlip.avoidSteps) && this._options.payment.bankSlip.avoidSteps == true) {
      this._options.errors.push({ 'message': `Não possível gerar pdf de um pagamento com boleto se não tiver um valor ou data de vencimento.`})
      return
    }

    if (!_isNullOrUndefined(this._options.payment.bankSlip.addNoteToInstructions)) {
      if (!_isBoolean(this._options.payment.bankSlip.addNoteToInstructions)) this._options.errors.push({ 'message': `O campo para habilitar informações na instrução está inválido.` })
    }

    if (!_isNullOrUndefined(this._options.payment.bankSlip.note)) {
      if (!_isString(this._options.payment.bankSlip.note)) {
        this._options.errors.push({ 'message': `O campo descrição do pagamento do boleto está inválido.` })
        return
      }
      if (this._options.payment.bankSlip.note.length > PaymentLimit.MAX_CARACTERES_INSTRUCTIONS) this._options.errors.push({ 'message': `O tamanho máximo permitido para o campo de descrição do pagamento é ${PaymentLimit.MAX_CARACTERES_INSTRUCTIONS}.` })
    }

    if (!_isNullOrUndefined(this._options.payment.bankSlip.acceptedUntil)) {
      if (!_isNumberPositiveOrNeutral(this._options.payment.bankSlip.acceptedUntil)) {
        this._options.errors.push({ 'message': `O formato do campo para aceitar após o vencimento está inválido.` })
        return
      }
      if (this._options.payment.bankSlip.acceptedUntil > PaymentLimit.MAX_ACCEPTED_UNTIL) this._options.errors.push({ 'message': `A quantidade de dias máximo permitido para aceitar após vencimento é ${PaymentLimit.MAX_ACCEPTED_UNTIL}.` })
      if (this._options.payment.bankSlip.acceptedUntil == 0 && !_isNullOrUndefined(this._options.payment.bankSlip.interest)) this._options.errors.push({ 'message': `Não é permitido aplicar juros. Porque o boleto não está configurado para aceitar após vencimento.` })
      if (this._options.payment.bankSlip.acceptedUntil == 0 && !_isNullOrUndefined(this._options.payment.bankSlip.fines)) this._options.errors.push({ 'message': `Não é permitido aplicar multa. Porque o boleto não está configurado para aceitar após vencimento.` })
    }

    if (!_isNullOrUndefined(this._options.payment.bankSlip.discountDays)) {
      if (!_isNumberPositiveOrNeutral(this._options.payment.bankSlip.discountDays)) {
        this._options.errors.push({ 'message': `O formato do campo para dias de desconto está inválido.` })
        return
      }
      if (this._options.payment.bankSlip.discountDays > PaymentLimit.MAX_DISCOUNT_DAYS) this._options.errors.push({ 'message': `A quantidade de dias máximo permitido para descontos é ${PaymentLimit.MAX_DISCOUNT_DAYS}.` })
    }

    if (!_isNullOrUndefined(this._options.payment.bankSlip.interest)) {
      if (!_isNumberPositive(this._options.payment.bankSlip.interest)) {
        this._options.errors.push({ 'message': `O formato do campo para o valor de multa está inválido.` })
        return
      }
      if (this._options.payment.bankSlip.interest < PaymentLimit.MIN_BANK_SLIP_INTEREST) this._options.errors.push({ 'message': `O valor minimo para juros é ${PaymentLimit.MIN_BANK_SLIP_INTEREST}%.` })
      if (this._options.payment.bankSlip.interest > PaymentLimit.MAX_BANK_SLIP_INTEREST) this._options.errors.push({ 'message': `O valor máximo para juros é ${PaymentLimit.MAX_BANK_SLIP_INTEREST}%.` })
    }

    if (!_isNullOrUndefined(this._options.payment.bankSlip.fines)) {
      if (!_isNumberPositive(this._options.payment.bankSlip.fines)) {
        this._options.errors.push({ 'message': `O formato do campo para o valor de multa está inválido.` })
        return
      }
      if (this._options.payment.bankSlip.fines < PaymentLimit.MIN_BANK_SLIP_FINES) this._options.errors.push({ 'message': `O valor minimo para multa é ${PaymentLimit.MIN_BANK_SLIP_FINES}%.` })
      if (this._options.payment.bankSlip.fines > PaymentLimit.MAX_BANK_SLIP_FINES) this._options.errors.push({ 'message': `O valor máximo para multa é ${PaymentLimit.MAX_BANK_SLIP_FINES}%.` })
    }

    if (!_isNullOrUndefined(this._options.payment.bankSlip.discount)) {
      if (!_isNumberPositive(this._options.payment.bankSlip.discount)) {
        this._options.errors.push({ 'message': `O formato do campo para o valor do desconto está inválido.` })
        return
      }

      if (_isNullOrUndefined(this._options.payment.amount))  {
        this._options.errors.push({ 'message': `Não é possivel calcular o desconto sem o valor do pagamento.` })
        return
      }

      var calculateMaximumDiscount = new CalculateMaximumDiscount(this._options.payment.amount).calculate()
      if (calculateMaximumDiscount < this._options.payment.bankSlip.discount) this._options.errors.push({ 'message': `A quantidade máxima de desconto mediante ao valor do pagamento é: ${calculateMaximumDiscount}%.` })

      if (_isNullOrUndefined(this._options.payment.bankSlip.discountDays)) this._options.errors.push({ 'message': `Não é possivel adicionar desconto ao boleto, pois não está configurado a quantidade de dias para desconto.` })
    }
  }

  _validatePayers() {
    if (!_isArray(this._options.payment.payers)) {
      this._options.errors.push({ 'message': 'O formato dos pagadores está inválido.' })
      return
    }

    this._options.payment.payers.forEach((payer, index) => {
      if (!_isObject(payer)) this._options.errors.push({ 'message': `O formato do pagador está incorreto.` })
      if (!_isNullOrUndefined(payer.sellingKey))
        if (!_isString(payer.sellingKey)) this._options.errors.push({ 'message': `O formato da chave de venda do pagador do indice ${index} está incorreto.` })
      if (!_isString(payer.fullName)) this._options.errors.push({ 'message': `O nome do pagador do indice ${index} está inválido.` })
      if (!_isString(payer.taxDocument)) this._options.errors.push({ 'message': `O formato do documento do pagador ${payer.fullName} está incorreto.` })
      if (!new TaxDocument(payer.taxDocument).isValid()) this._options.errors.push({ 'message': `O documento do pagador ${payer.fullName} está inválido.` })
      if (!_isNullOrUndefined(payer.mobile) && !_isString(payer.mobile)) this._options.errors.push({ 'message': `O celular do pagador ${payer.fullName} está inválido.` })
      if (!_isNullOrUndefined(payer.email) && !_isString(payer.email)) this._options.errors.push({ 'message': `O email do pagador ${payer.fullName} está inválido.` })
      if (!_isNullOrUndefined(payer.email)) {
        if (!new Email(payer.email).isValid()) this._options.errors.push({ 'message': `O email do pagador ${payer.fullName} está inválido.` })
      }

      if (!_isNullOrUndefined(payer.mobile)) {
        if (!new Phone(payer.mobile).isValid()) this._options.errors.push({ 'message': `O celular do pagador ${payer.fullName} está inválido.` })
      }
    })
  }

  _validateFunctionsCallBacks() {
    if (!_isNullOrUndefined(this._options.abort))
      if (!_isFunction(this._options.abort)) throw new Error('Invalid options.abort: Expected Function.')
    if (!_isNullOrUndefined(this._options.success))
      if (!_isFunction(this._options.success)) throw new Error('Invalid options.success: Expected Function.')
    if (!_isNullOrUndefined(this._options.fail))
      if (!_isFunction(this._options.fail)) throw new Error('Invalid options.fail: Expected Function.')
  }

  _validatePaymentConfig() {
    if (!_isObject(this._options.payment)) this._options.errors.push({ 'message': 'O formato do pagamento está inválido.' })
    if (!_isNullOrUndefined(this._options.payment.amount))
      if (!_isNumber(this._options.payment.amount)) this._options.errors.push({ 'message': 'O valor do pagamento não é numérico.' })
    if (!_isBoolean(this._options.payment.replicateAmount)) this._options.errors.push({ 'message': 'O campo de configuração da mudança de valor está inválido.' })
    if (!_isBoolean(this._options.payment.bankSlipEnabled)) this._options.errors.push({ 'message': 'O campo para habilitar a venda com boleto está inválido.' })
    if (!_isBoolean(this._options.payment.creditEnabled)) this._options.errors.push({ 'message': 'O campo para habilitar a venda com cartão de crédito está inválido.' })
    if (!_isBoolean(this._options.payment.debitEnabled)) this._options.errors.push({ 'message': 'O campo para habilitar a venda com cartão de débito está inválido.' })
    if (!_isBoolean(this._options.payment.deviceEnabled) && !_isNullOrUndefined(this._options.payment.deviceEnabled)) this._options.errors.push({ 'message': 'O formato para configuração da maquinha está incorreto.' })

    if (!_isNullOrUndefined(this._options.payment.bankSlip)) {
      if (!_isNullOrUndefined(this._options.payment.bankSlip.installments)) {
        if (!_isNumberPositive(this._options.payment.bankSlip.installments)) {
          this._options.errors.push({ 'message': `O quandidade de parcela do pagamento varia entre 1 a 12 parcelas.` })
          return
        }
        if (this._options.payment.bankSlip.installments > PaymentLimit.BANK_SLIP_INSTALLMENTS_MAXIMUM) {
          this._options.errors.push({ 'message': `O valor máximo para parcelas de boleto é ${PaymentLimit.BANK_SLIP_INSTALLMENTS_MAXIMUM}.` })
        }
      }
    }
  }

  _validateEnvironment() {
    if (!_isObject(this._options)) this._options.errors.push({ 'message': 'O formato da configuração do ligthbox está incorreto.' })
    if (!_isString(this._options.environment)) this._options.errors.push({ 'message': 'O campo de configuração de ambiente está invalido.' })
    if (this._options.environment !== Environment.Sandbox && this._options.environment !== Environment.Production) {
      this._options.errors.push({ 'message': `O ambiente ${this._options.environment} que está rodando não é homologado pela paggcerto.` })
    }
    if (!_isString(this._options.token)) this._options.errors.push({ 'message': 'O formato do token está inválido.' })
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
