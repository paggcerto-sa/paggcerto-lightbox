import { _isNumberPositive } from './annotations'
import { PaymentLimit } from '../constants'

class CalculateMaximumDiscount {
  constructor (amount) {
    if (!_isNumberPositive(amount)) new Error('amount: only numbers positive.')
    this._amount = amount
    this._minimumAmount = PaymentLimit.BANK_SLIP_AMOUNT_MINIMUM
  }

  calculate() {
    return Math.floor((100 - this._minimumAmount * 100 / this._amount) * 100) / 100
  }
}

export default CalculateMaximumDiscount
