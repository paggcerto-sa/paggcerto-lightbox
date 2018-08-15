import $ from 'node_modules/jquery'
import Installments from 'src/js/util/installments'
import { EventName, PaymentLimit } from 'src/js/constants'

const ClassName = {
  INSTALLMENT_NUMBER: 'installment-number',
  INSTALLMENT_VALUE: 'installment-value'
}

const VIEW = `
  <div class="installment-options"></div>
`

const VIEW_INSTALLMENTS = `
  <label>
    <input type="radio" name="installments">
    <span class="installment-option">
      <span class="${ClassName.INSTALLMENT_NUMBER}"></span>
      <span class="${ClassName.INSTALLMENT_VALUE}"></span>
    </span>
  </label>
`

class InstallmentOptionsPartial {
  constructor($container, options) {
    this._$container = $container
    this._options = options
  }

  _isCreditCard() {
    return !!this._options.payment.card
  }

  _isBankSlip() {
    return !!this._options.payment.bankSlip
  }

  _getMinimumInstallmentAmount() {
    if (this._isBankSlip()) return PaymentLimit.BANK_SLIP_AMOUNT_MINIMUM
    if (this._isCreditCard()) return PaymentLimit.CREDIT_AMOUNT_MINIMUM_MULTIPLE_INSTALLMENT
  }

  _getMaximumInstallmentNumber() {
    if (this._isBankSlip()) return PaymentLimit.BANK_SLIP_INSTALLMENTS_MAXIMUM
    if (this._isCreditCard()) return this._options.payment.card.bin.maximumInstallment
  }

  render() {
    this._$installmentOptions = $(VIEW)
    this._$container.replaceWith(this._$installmentOptions)
    this._options.payment.installments = this._options.payment.installments || 1

    const amount = this._options.payment.amount
    const minimummAmount = this._getMinimumInstallmentAmount()
    const maximumNumber = this._getMaximumInstallmentNumber()
    const installments = new Installments(amount, minimummAmount, maximumNumber).asArray()

    let $firstInstallment = null

    installments.forEach((installment, index) => {
      const $installment = $(VIEW_INSTALLMENTS)
      $firstInstallment = $firstInstallment || $installment

      $installment.on(EventName.CHANGE, () => {
        this._options.payment.installments = installment.number
      })

      $installment.find(`.${ClassName.INSTALLMENT_NUMBER}`).text(`${installment.number}x`)
      $installment.find(`.${ClassName.INSTALLMENT_VALUE}`).text(installment.amountText)
      $installment.find('input').get(0).checked = index === 0

      this._$installmentOptions.append($installment)
    })

    $firstInstallment.focus()
  }
}

export default InstallmentOptionsPartial
