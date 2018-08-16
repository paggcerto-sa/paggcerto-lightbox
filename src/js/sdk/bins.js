import PaymentsApi from './payments-api'
import Textual from '../util/textual'

class Bins {
  constructor(options) {
    this._paymentsApi = new PaymentsApi(options)
  }

  _isValid(cardNumber) {
    const digits = new Textual(cardNumber)
      .onlyNumbers()
      .asString()
      .split('')
      .reverse()

    if (digits.length < 13 || digits.length > 19) {
      return false
    }

    let sum = 0

    for (let i = 0; i < digits.length; i++) {
      const charCode = digits[i].charCodeAt(0)
      const result = (charCode - 48) * (i % 2 === 0 ? 1 : 2)

      sum += parseInt(result / 10, 10) + result % 10
    }

    return sum % 10 === 0
  }

  async list() {
    if (!!this._binList) return
    this._binList = await this._paymentsApi.bins()
  }

  async identify(cardNumber) {
    if (!this._isValid(cardNumber)) return

    for (let i = 0; i < this._binList.bins.length; i++) {
      const bin = this._binList.bins[i]
      const regex = new RegExp(bin.regex)

      if (regex.test(cardNumber)) {
        return bin
      }
    }
  }
}

export default Bins
