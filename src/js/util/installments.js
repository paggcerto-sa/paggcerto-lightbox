import Currency from './currency'

class Installments {
  constructor(amount, minimummAmount, maximumNumber, discount) {
    this._amount = amount
    this._minimummAmount = minimummAmount
    this._maximumNumber = maximumNumber
    this._discount = discount
  }

  asArray() {
    const installments = []

    for (var number = 1; number <= this._maximumNumber; number++) {
      const currency = new Currency(this._amount / number)
      const amount = currency.asNumber()
      const amountWithDiscount = currency
        .applyDiscountPercent(this._discount)
        .asNumber()

      if (number > 1 && amountWithDiscount < this._minimummAmount) break

      installments.push({
        number: number,
        amount: amount
      })
    }

    return installments
  }
}

export default Installments
