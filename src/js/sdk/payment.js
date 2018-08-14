import moment from 'node_modules/moment'

class Payment {
  constructor(options) {
    this._options = options
  }

  _getDueDates() {
    const firstDueDate = this._options.payment.bankSlip.dueDate
    const installments = this._options.payment.installments
    const dueDates = []

    for (let installment = 0; installment < installments; installment++) {
      const dueDate = moment(firstDueDate).add(installment, 'M').toDate()
      dueDates.push(dueDate)
    }

    return dueDates
  }

  _getSellingKey() {
    if (this._options.payment.payers.length === 0) return null
    return this._options.payment.payers[0].sellingKey
  }

  _mapPayers() {
    return this._options.payment.payers.map(payer => {
      payer.name = payer.fullName
      return payer
    })
  }

  toBankSlip() {
    return {
      amount: this._options.payment.amount,
      discount: this._options.payment.bankSlip.discount,
      discountDays: this._options.payment.bankSlip.discountDays,
      fines: this._options.payment.bankSlip.fines,
      interest: this._options.payment.bankSlip.interest,
      acceptedUntil: this._options.payment.bankSlip.acceptedUntil,
      payers: this._mapPayers(),
      dates: this._getDueDates(),
      geolocation: this._options.payment.geolocation
    }
  }

  toCreditCard() {
    return {
      sellingKey: this._getSellingKey(),
      amount: this._options.payment.amount,
      geolocation: this._options.payment.geolocation,
      cards: [
        {
          holderName: this._options.payment.card.holderName,
          number: this._options.payment.card.number,
          expirationMonth: this._options.payment.card.expirationMonth,
          expirationYear: this._options.payment.card.expirationYear,
          securityCode: this._options.payment.card.cvv,
          installments: this._options.payment.installments,
          amountPaid: this._options.payment.amount,
          credit: true
        }
      ]
    }
  }
}

export default Payment
