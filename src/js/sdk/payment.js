import moment from 'moment'
import Textual from '../util/textual'

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

  getSellingKey() {
    if (this._options.payment.payers.length === 0) return null
    return this._options.payment.payers[0].sellingKey
  }

  _mapPayers() {
    return this._options.payment.payers.map(payer => {
      payer.name = this._trim(payer.fullName)
      payer.taxDocument = this._trim(payer.taxDocument)

      return payer
    })
  }

  _trim(text) {
    return new Textual(text).clearWhiteSpaces().asString()
  }

  toBankSlip() {
    return {
      amount: this._options.payment.amount,
      note: this._options.payment.note,
      replicateAmount: this._options.payment.replicateAmount,
      discount: this._options.payment.bankSlip.discount,
      discountDays: this._options.payment.bankSlip.discountDays,
      fines: this._options.payment.bankSlip.fines,
      interest: this._options.payment.bankSlip.interest,
      acceptedUntil: this._options.payment.bankSlip.acceptedUntil,
      payers: this._mapPayers(),
      dates: this._getDueDates(),
      geolocation: this._options.payment.geolocation,
      instructions: this._options.payment.bankSlip.addNoteToInstructions ? this._options.payment.note : null
    }
  }

  toCreditCard() {
    let securityCode = this._options.payment.card.cvv

    if (this._options.payment.card.bin.cardBrand === 'banesecard' && this._options.payment.redirected) {
      securityCode = '999'
    }

    return {
      sellingKey: this.getSellingKey(),
      amount: this._options.payment.amount,
      note: this._options.payment.note,
      geolocation: this._options.payment.geolocation,
      cards: [
        {
          holderName: this._trim(this._options.payment.card.holderName),
          number: this._options.payment.card.number,
          expirationMonth: this._options.payment.card.expirationMonth,
          expirationYear: this._options.payment.card.expirationYear,
          securityCode: securityCode,
          installments: this._options.payment.installments,
          amountPaid: this._options.payment.amount,
          credit: true
        }
      ]
    }
  }
}

export default Payment
