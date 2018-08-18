import { NAMESPACE, ClassName } from '../constants'
import CardApprovedForm from './card-approved-form'
import CardReprovedForm from './card-reproved-form'
import InputAmountPartial from '../partials/input-amount-partial'
import PayMethodIconsPartial from '../partials/pay-method-icons-partial'

const Selector = {
  INPUT_AMOUNT: `${NAMESPACE}_inputAmount`,
  PAY_METHODS: `${NAMESPACE}_payMethods`,
  SPINNER: `${NAMESPACE}_spinner`,
  DEVICE_IMG: `${NAMESPACE}_deviceImg`
}

const PROCESSING_MSG = 'Estamos quase lá!<br> Sua transação está sendo processada...'

const VIEW = `
  <div class="${ClassName.HEADER}">
    Estamos quase lá!<br> Digite sua senha :)
  </div>
  <div class="${ClassName.BODY}">
    <div class="row">
      <div class="col border-right">
        <div class="form-group text-center">
          <span id="${Selector.INPUT_AMOUNT}"></span>
          <span class="pay-method-text">Crédito</span>
        </div>
      </div>
      <div class="col">
        <div id="${Selector.SPINNER}" class="spinner d-none">
          <div class="spinner-bar"></div>
          <div class="icon-logo-sm"></div>
        </div>
        <div id="${Selector.DEVICE_IMG}" class="hidden">
          <h1>Digite a senha</h1>
        </div>
      </div>
    </div>
  </div>
  <div class="${ClassName.FOOTER} text-center">
    <span id="${Selector.PAY_METHODS}"></span>
  </div>
`

class PinpadProcessingForm {

  constructor($container, options) {
    this._$container = $container
    this._options = options
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
    this._payMethodIconsPartial.activeIcon(this._options.payment.card.bin.cardBrand)
  }

  _toggleSpinner() {
    const spinner = this._$container.find(`#${Selector.SPINNER}`)
    const deviceImg = this._$container.find(`#${Selector.DEVICE_IMG}`)

    spinner.toggleClass('d-none')
    deviceImg.toggleClass('d-none')
  }

  _setTitle(msg) {
    this._$container.find(`.${ClassName.HEADER}`).html(msg)
  }

  _processStatus(type, msg) {
    if (type === 'DEVICE_MSG' && msg == 'RETIRE O CARTAO') {
      this._setTitle(PROCESSING_MSG)
      this._toggleSpinner()
    }
  }

  async _process() {

    if (this._options.pinpad === null) {
      await new CardErrorForm(this._$container, this._options).render()
      return
    }

    const sellingkey = this._options.sellingkey
    const installments = this._options.payment.installments
    const token = this._options.token
    const pinpad = this._options.pinpad

    const transactionResponse = await pinpad.pay(
      sellingkey,
      installments,
      token,
      (type, msg) => this._processStatus(type, msg)
    )

    if (transactionResponse === null) {
      await new CardErrorForm(this._$container, this._options).render()
    }

    this._options.processedPayment = transactionResponse.body

    if (this._options.processedPayment.status === 'paid') {
      new CardApprovedForm(this._$container, this._options).render()
    } else {
      new CardReprovedForm(this._$container, this._options).render()
    }
  }

  async render() {
    this._$container.html(VIEW)

    this._renderInputAmount()
    this._renderPayMethodIcons()

    await this._process()
  }
}

export default PinpadProcessingForm
