class Payment {
  constructor(options) {
    this._options = options
  }

  _getSellingKey() {
    if (this._options.payment.payers.length === 0) return null
    return this._options.payment.payers[0].sellingKey
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
