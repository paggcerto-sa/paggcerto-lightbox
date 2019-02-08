import moment from 'moment'
import Textual from '../util/textual'
import { _isNullOrUndefined } from '../util/annotations'

class Payment {
  constructor(options) {
    this._options = options
  }

  getSellingKey() {
    if (this._options.payment.payers.length === 0) return null
    return this._options.payment.payers[0].sellingKey
  }

  _mapPayers() {
    return this._options.payment.payers.map(payer => {
      payer.name = this._trim(payer.fullName)
      payer.taxDocument = this._trim(payer.taxDocument)
      payer.email = this._trim(payer.email)
      payer.mobile = this._trim(payer.mobile)
      payer.bankSlips = this._createBankSlipList()

      return payer
    })
  }

  _trim(text) {
    return new Textual(text).clearWhiteSpaces().asString()
  }

  _getInstallments() {
    if (this._options.payment.bankSlip.avoidSteps) {
      if (!_isNullOrUndefined(this._options.payment.bankSlip.installments)) return this._options.payment.bankSlip.installments
    }
    return this._options.payment.installments
  }

  _createBankSlipList() {
    const installments = this._getInstallments()
    var bankSlips = []
    var bankSlip = {
      amount: 0,
      discount: 0,
      dueDate: '',
      fines: 0,
      interest: 0,
      discountDays: 0,
      acceptedUntil: 0,
      instructions: '',
      secondBankSlip: null
    }
    for (var i = 0; i < installments; i++) {
      bankSlip.amount = this._options.payment.replicateAmount ? this._options.payment.amount : (this._options.payment.amount/installments).toFixed(2)
      bankSlip.discount = this._options.payment.bankSlip.discount
      bankSlip.dueDate = moment(this._options.payment.bankSlip.dueDate).add(i, 'M').toDate()
      bankSlip.fines = this._options.payment.bankSlip.fines
      bankSlip.interest = this._options.payment.bankSlip.interest
      bankSlip.discountDays = this._options.payment.bankSlip.discountDays
      bankSlip.acceptedUntil = this._options.payment.bankSlip.acceptedUntil
      bankSlip.instructions = this._options.payment.bankSlip.addNoteToInstructions ? this._options.payment.note : null
      bankSlip.secondBankSlip = this._options.payment.bankSlip.permitSecondBankSlip ? 0 : null
      bankSlips.push(bankSlip)
      bankSlip = {
        amount: 0,
        discount: 0,
        dueDate: '',
        fines: 0,
        interest: 0,
        discountDays: 0,
        acceptedUntil: 0,
        instructions: '',
        secondBankSlip: null
      }
    }
    console.log(bankSlips)
    return bankSlips
  }

  toBankSlip() {
    return {
      note: this._options.payment.note,
      payers: this._mapPayers()
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
