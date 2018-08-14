import $ from 'node_modules/jquery'
import Environment from './environment'

class PaymentsApi {
  constructor(options) {
    this._token = options.token
    this._environment = new Environment(options)
  }

  _headers() {
    return {
      'Authorization': `Bearer ${this._token}`,
      'Content-Type': 'application/json'
    }
  }

  async bins() {
    return await $.ajax({
      url: this._environment.Url.BINS,
      method: 'GET',
      headers: this._headers()
    })
  }

  async downloadPdf(paymentId) {
    return await $.ajax({
      url: this._environment.Url.BANK_SLIP_PDF.replace('{paymentId}', paymentId),
      method: 'GET',
      headers: this._headers(),
      xhrFields: { responseType: 'blob' }
    })
  }

  async downloadZip(paymentIds) {
    const payments = paymentIds.map((id, index) => `payments[${index}]=${id}`).join('&')

    return await $.ajax({
      url: this._environment.Url.BANK_SLIP_ZIP.replace('{payments}', payments),
      method: 'GET',
      headers: this._headers(),
      xhrFields: { responseType: 'blob' }
    })
  }

  async payWithBankSlips(payment) {
    return await $.ajax({
      url: this._environment.Url.PAY_WITH_BANK_SLIPS,
      method: 'POST',
      headers: this._headers(),
      data: JSON.stringify(payment)
    })
  }

  async payWithCards(payment) {
    return await $.ajax({
      url: this._environment.Url.PAY_WITH_CARDS,
      method: 'POST',
      headers: this._headers(),
      data: JSON.stringify(payment)
    })
  }

  async sendCardReceipt(nsu, contact) {
    return await $.ajax({
      url: this._environment.Url.SEND_CARD_RECEIPT.replace('{nsu}', nsu),
      method: 'POST',
      headers: this._headers(),
      data: JSON.stringify(contact)
    })
  }
}

export default PaymentsApi
