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
      url: this._environment.Url.SEND_CARD_RECEIPT.replace(':nsu', nsu),
      method: 'POST',
      headers: this._headers(),
      data: JSON.stringify(contact)
    })
  }
}

export default PaymentsApi
