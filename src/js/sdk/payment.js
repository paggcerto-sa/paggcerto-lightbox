class Payment {
  constructor(options) {
    this._options = options
  }

  toCreditCard() {
    return {
      sellingKey: null,
      amount: this._options.payment.amount,
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
