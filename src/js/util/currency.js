class Currency {
  constructor(amount) {
    this._amount = amount || 0
  }

  _toFixed() {
    return this._amount.toFixed(2)
  }

  isValid() {
    return this._toFixed() === this._amount.toString()
  }

  asNumber() {
    return Number(this._toFixed())
  }

  asString() {
    return 'R$ ' + this._toFixed().replace('.', ',')
  }
}

export default Currency
