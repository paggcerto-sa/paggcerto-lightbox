class Installment {
  constructor(maximumInstallment, amount) {
    this._maximumInstallment = maximumInstallment
    this._amount = amount
  }

  asArray() {
    const installments = []

    for (var installment = 1; installment <= this._maximumInstallment; installment++) {
      var amount = (this._amount / installment).toFixed(2)
      var amountText = 'R$ ' + amount.replace('.', ',')

      installments.push({
        number: installment,
        amount: amount,
        amountText: amountText
      })
    }

    return installments
  }
}

export default Installment
