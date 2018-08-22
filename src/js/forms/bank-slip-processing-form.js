import BankSlipErrorForm from '../forms/bank-slip-error-form'
import BankSlipCreatedForm from '../forms/bank-slip-created-form'
import InputAmountPartial from '../partials/input-amount-partial'
import PayMethodIconsPartial from '../partials/pay-method-icons-partial'
import PaymentsApi from '../sdk/payments-api'
import Payment from '../sdk/payment'
import { NAMESPACE, ClassName } from '../constants'

const Selector = {
  INPUT_AMOUNT: `${NAMESPACE}_inputAmount`,
  PAY_METHODS: `${NAMESPACE}_payMethods`
}

const VIEW = `
  <div class="${ClassName.HEADER}">
    Estamos quase lá!<br>
    Os boletos estão sendo emitidos...
  </div>
  <div class="${ClassName.BODY}">
    <div class="row">
      <div class="col border-right">
        <div class="form-group text-center">
          <span id="${Selector.INPUT_AMOUNT}"></span>
          <span class="pay-method-text">Boleto</span>
        </div>
      </div>
      <div class="col">
        <div class="spinner">
          <div class="spinner-bar"></div>
          <div class="icon-logo-sm"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="${ClassName.FOOTER} text-center">
    <span id="${Selector.PAY_METHODS}"></span>
  </div>
`

class BankSlipProcessingForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
  }

  async render() {
    this._$container.html(VIEW)

    this._renderInputAmount()
    this._renderPayMethodIcons()

    await this._process()
  }

  _renderInputAmount() {
    const $inputAmount = this._$container.find(`#${Selector.INPUT_AMOUNT}`)
    this._inputAmountPartial = new InputAmountPartial($inputAmount, this._options)
    this._inputAmountPartial.disabled(true)
    this._inputAmountPartial.render()
  }

  _renderPayMethodIcons() {
    const $payMethods = this._$container.find(`#${Selector.PAY_METHODS}`)
    this._payMethodIconsPartial = new PayMethodIconsPartial($payMethods)
    this._payMethodIconsPartial.render()
    this._payMethodIconsPartial.activeIcon('bank-slip')
  }

  async _process() {
    const paymentsApi = new PaymentsApi(this._options)
    const payment = new Payment(this._options).toBankSlip()

    try {
      this._options.processedPayment = await paymentsApi.payWithBankSlips(payment)

      const bankSlipCreatedForm = new BankSlipCreatedForm(this._$container, this._options)
      bankSlipCreatedForm.render()
    } catch (e) {
      const bankSlipErrorForm = new BankSlipErrorForm(this._$container, this._options)
      bankSlipErrorForm.render()
    }
  }
}

export default BankSlipProcessingForm
