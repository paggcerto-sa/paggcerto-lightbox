import Currency from './currency'

class Installments {
  constructor(amount, minimummAmount, maximumNumber, discount) {
    this._amount = amount
    this._minimummAmount = minimummAmount
    this._maximumNumber = maximumNumber
    this._discount = discount
  }

  asArray(replicateAmount = false) {
    const installments = []

    for (var number = 1; number <= this._maximumNumber; number++) {
      let amount = null

      if (replicateAmount) {
        amount = this._amount
      } else {
        const currency = new Currency(this._amount / number)
        const amountWithDiscount = currency
        .applyDiscountPercent(this._discount)
        .asNumber()

        if (number > 1 && amountWithDiscount < this._minimummAmount) break

        amount = currency.asNumber()
      }

      installments.push({
        number: number,
        amount: amount
      })
    }

    return installments
  }
}

export default Installments
