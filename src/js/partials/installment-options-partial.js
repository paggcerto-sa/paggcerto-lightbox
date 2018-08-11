import $ from 'node_modules/jquery'
import Installment from 'src/js/util/installment'
import { EventName } from 'src/js/constants'

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

  render() {
    this._$installmentOptions = $(VIEW)
    this._$container.replaceWith(this._$installmentOptions)
    this._options.payment.installments = this._options.payment.installments || 1

    const maximumInstallment = this._options.payment.card.bin.maximumInstallment
    const amount = this._options.payment.amount
    const installments = new Installment(maximumInstallment, amount).asArray()

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
