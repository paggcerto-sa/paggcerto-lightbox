import Currency from './currency'

class Installment {
  constructor(maximumInstallment, amount) {
    this._maximumInstallment = maximumInstallment
    this._amount = amount
  }

  asArray() {
    const installments = []

    for (var installment = 1; installment <= this._maximumInstallment; installment++) {
      const currency = new Currency(this._amount / installment)

      installments.push({
        number: installment,
        amount: currency.asNumber(),
        amountText: currency.asString()
      })
    }

    return installments
  }
}

export default Installment
