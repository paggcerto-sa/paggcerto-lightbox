import Currency from './currency'

class Installments {
  constructor(amount, minimummAmount, maximumNumber) {
    this._amount = amount
    this._minimummAmount = minimummAmount
    this._maximumNumber = maximumNumber
  }

  asArray() {
    const installments = []

    for (var number = 1; number <= this._maximumNumber; number++) {
      const currency = new Currency(this._amount / number)
      const amount = currency.asNumber()
      const amountText = currency.asString()

      if (number > 1 && amount < this._minimummAmount) break

      installments.push({
        number: number,
        amount: amount,
        amountText: amountText
      })
    }

    return installments
  }
}

export default Installments
