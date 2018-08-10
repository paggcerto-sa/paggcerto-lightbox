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
    if (!this._isString(this._options.token)) throw new Error('Invalid options.token: Expected String.')
    if (!this._isObject(this._options.payment)) throw new Error('Invalid options.payment: Expected Object.')
    if (!this._isBoolean(this._options.payment.acceptBankSlip)) throw new Error('Invalid options.payment.acceptBankSlip: Expected Boolean.')
    if (!this._isBoolean(this._options.payment.acceptCredit)) throw new Error('Invalid options.payment.acceptCredit: Expected Boolean.')
    if (!this._isBoolean(this._options.payment.acceptDebit)) throw new Error('Invalid options.payment.acceptDebit: Expected Boolean.')
    if (!this._isArray(this._options.payment.payers)) throw new Error('Invalid options.payment.payers: Expected Array.')

    this._options.payment.payers.forEach((payer, index) => {
      if (!this._isObject(payer)) throw new Error(`Invalid options.payment.payers[${index}]: Expected Object.`)
      if (!this._isString(payer.fullName)) throw new Error(`Invalid options.payment.payers[${index}].name: Expected String.`)
      if (!this._isString(payer.taxDocument)) throw new Error(`Invalid options.payment.payers[${index}].taxDocument: Expected String.`)
    })

    if (!this._isFunction(this._options.success)) throw new Error('Invalid options.success: Expected Function.')
    if (!this._isFunction(this._options.fail)) throw new Error('Invalid options.fail: Expected Function.')
  }

  _setDefaultValues() {
    this._options.payment = this._options.payment || {}
    this._options.payment.processing = false
    this._options.payment.bankSlip = null
    this._options.payment.card = null
  }

  _setHelperValues() {
    const acceptBankSlip = this._options.payment.acceptBankSlip
    const acceptCredit = this._options.payment.acceptCredit
    const acceptDebit = this._options.payment.acceptDebit

    this._options.payment.onlyBankSlip = acceptBankSlip && !(acceptCredit || acceptDebit)
    this._options.payment.onlyCredit = acceptCredit && !(acceptDebit || acceptBankSlip)
    this._options.payment.onlyDebit = acceptDebit && !(acceptCredit || acceptBankSlip)
    this._options.payment.noMethodAccepted = !(acceptBankSlip || acceptCredit || acceptDebit)
  }

  asObject() {
    this._validate()
    this._setDefaultValues()
    this._setHelperValues()

    return this._options
  }
}

export default LightboxOptions
