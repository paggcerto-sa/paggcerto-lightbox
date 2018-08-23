import $ from 'jquery'
import moment from 'moment'
import Installments from '../util/installments'
import Currency from '../util/currency'
import { EventName, PaymentLimit } from '../constants'

const ClassName = {
  INSTALLMENT_NUMBER: 'installment-number',
  INSTALLMENT_VALUE: 'installment-value'
}

const Selector = {
  INSTALLMENT_AMOUNT: `${ClassName.INSTALLMENT_VALUE} span`,
  INSTALLMENT_DUE_DATE: `${ClassName.INSTALLMENT_VALUE} small`
}

const VIEW = `
  <div class="installment-options"></div>
`

const VIEW_INSTALLMENTS = `
  <label>
    <input type="radio" name="installments">
    <span class="installment-option">
      <span class="${ClassName.INSTALLMENT_NUMBER}"></span>
      <span class="${ClassName.INSTALLMENT_VALUE}">
        <span></span>
        <small></small>
      </span>
    </span>
  </label>
`

class InstallmentOptionsPartial {
  constructor($container, options) {
    this._$container = $container
    this._options = options
  }

  render() {
    this._$installmentOptions = $(VIEW)
    this._$container.replaceWith(this._$installmentOptions)
    this._options.payment.installments = this._options.payment.installments || 1

    const amount = this._options.payment.amount
    const replicateAmount = this._options.payment.replicateAmount
    const discountPercent = this._options.payment.bankSlip && this._options.payment.bankSlip.discount
    const minimummAmount = this._getMinimumInstallmentAmount()
    const maximumNumber = this._getMaximumInstallmentNumber()
    const installments = new Installments(amount, minimummAmount, maximumNumber, discountPercent).asArray(replicateAmount)

    let $firstInstallment = null

    installments.forEach((installment) => {
      const $installment = $(VIEW_INSTALLMENTS)
      $firstInstallment = $firstInstallment || $installment

      $installment.on(EventName.CHANGE, () => {
        this._options.payment.installments = installment.number
      })

      $installment.find(`.${ClassName.INSTALLMENT_NUMBER}`).text(`${installment.number}x`)
      $installment.find(`.${Selector.INSTALLMENT_AMOUNT}`).text(new Currency(installment.amount).asString())
      $installment.find(`.${Selector.INSTALLMENT_DUE_DATE}`).text(this._getDueDatePeriodText(installment.number))
      $installment.find('input').get(0).checked = installment.number === 1

      this._$installmentOptions.append($installment)
    })

    $firstInstallment.focus()
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

  _getDueDatePeriodText(installments) {
    if (!this._options.payment.bankSlip) return ''

    const firstDueDate = this._options.payment.bankSlip.dueDate
    const firstDueDateText = moment(firstDueDate).format('DD/MM/YYYY')
    const lastDueDate = installments === 1 ? null : moment(firstDueDate).add(installments - 1, 'M')
    const lastDueDateText = lastDueDate ? moment(lastDueDate).format('DD/MM/YYYY') : null

    return lastDueDateText ? `${firstDueDateText} até ${lastDueDateText}` : firstDueDateText
  }
}

export default InstallmentOptionsPartial
