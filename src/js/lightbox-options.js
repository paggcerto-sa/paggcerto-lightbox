class LightboxOptions {
  constructor(options) {
    this._options = options
  }

  _isNotDefined(value) {
    return value === null || value === undefined
  }

  _validate() {
    if (typeof this._options !== 'object') throw new Error('Invalid options: Expected Object.')
    if (typeof this._options.token !== 'string') throw new Error('Invalid options.token: Expected String.')
    if (typeof this._options.payment !== 'object') throw new Error('Invalid options.payment: Expected Object.')
    if (!(this._options.payment.payers instanceof Array)) throw new Error('Invalid options.payment.payers: Expected Array.')

    this._options.payment.payers.forEach((payer, index) => {
      if (typeof payer !== 'object') throw new Error(`Invalid options.payment.payers[${index}]: Expected Object.`)
      if (typeof payer.fullName !== 'string') throw new Error(`Invalid options.payment.payers[${index}].name: Expected String.`)
      if (typeof payer.taxDocument !== 'string') throw new Error(`Invalid options.payment.payers[${index}].taxDocument: Expected String.`)
    })

    if (typeof this._options.success !== 'function') throw new Error('Invalid options.success: Expected Function.')
    if (typeof this._options.fail !== 'function') throw new Error('Invalid options.fail: Expected Function.')
  }

  _setDefaultValues() {
    this._options.payment = this._options.payment || {}

    if (this._isNotDefined(this._options.payment.credit)) {
      this._options.payment.credit = true
    }

    if (this._isNotDefined(this._options.payment.debit)) {
      this._options.payment.debit = true
    }

    if (this._isNotDefined(this._options.payment.bankSlip)) {
      this._options.payment.bankSlip = true
    }

    if (this._isNotDefined(this._options.payment.payers)) {
      this._options.payment.payers = []
    }
  }

  _setHelperValues() {
    this._options.payment.onlyBankSlip = this._options.payment.bankSlip && !(this._options.payment.credit || this._options.payment.debit)
    this._options.payment.onlyCredit = this._options.payment.credit && !(this._options.payment.debit || this._options.payment.bankSlip)
    this._options.payment.onlyDebit = this._options.payment.debit && !(this._options.payment.credit || this._options.payment.bankSlip)
    this._options.payment.allMethodsDisabled = !(this._options.payment.bankSlip || this._options.payment.credit || this._options.payment.debit)
  }

  asObject() {
    this._validate()
    this._setDefaultValues()
    this._setHelperValues()

    return this._options
  }
}

export default LightboxOptions
