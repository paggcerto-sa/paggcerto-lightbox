class Currency {
  constructor(amount) {
    this._amount = amount || 0
  }

  _toFixed() {
    let fixed = Math.floor((this._amount * 100))
    return (fixed / 100).toFixed(2)
  }

  applyDiscountPercent(discount) {
    const discountAmount = Number((this._amount * (discount || 0) / 100).toFixed(2))
    return new Currency(this._amount - discountAmount)
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
