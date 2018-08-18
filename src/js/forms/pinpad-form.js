import { NAMESPACE, ClassName } from '../constants'
import CardErrorForm from './card-error-form';
import CardInstallmentForm from './card-installments-form'
import InputAmountPartial from '../partials/input-amount-partial'
import PayMethodIconsPartial from '../partials/pay-method-icons-partial'

const Selector = {
  BTN_BANK_SLIP: `${NAMESPACE}_btnBankSlip`,
  BTN_CREDIT: `${NAMESPACE}_btnCredit`,
  BTN_DEBIT: `${NAMESPACE}_btnDebit`,
  BTN_CANCEL: `${NAMESPACE}_btnCancel`,
  INPUT_AMOUNT: `${NAMESPACE}_inputAmount`,
  PAY_METHODS: `${NAMESPACE}_payMethods`
}

const VIEW = `
  <div class="${ClassName.HEADER}">
    <p>Insira o seu cartão</p>
  </div>
  <div class="${ClassName.BODY}">
    <div class="row">
      <div class="col border-right">
        <div class="form-group">
          <span id="${Selector.INPUT_AMOUNT}"></span>
        </div>
      </div>
      <div class="col">
        <!-- imagem da maquininha --->
        <h1>Insira o cartao</h1>
      </div>
    </div>
  </div>
  <div class="${ClassName.FOOTER} text-center">
    <span id="${Selector.PAY_METHODS}"></span>
  </div>
`

export class PinpadForm {

  constructor($container, options, credit) {
    this._$container = $container
    this._options = options
    this._credit = credit
  }

  async render() {

    this._$container.html(VIEW)
    this._renderInputAmount()
    this._renderPayMethodIcons()

    const pinpad = this._options.pinpad
    const devices = await pinpad.listDevices()

    if (devices === null || devices.length === 0) {
      return
    }

    const device = devices[0].port
    const cardInformation = await pinpad.readCard(this._options.payment.amount, device, this._credit)

    if (cardInformation === null) {
      await new CardErrorForm(this._$container, this._options).render()
      return
    }

    const bins = this._options.payment.bins

    this._options.payment.card = {
      number: cardInformation.cardNumber,
      bin: await bins.identify(cardInformation.cardNumber)
    }

    if (!this._options.payment.card.bin.emvSupported) {
      await new CardErrorForm(this._$container, this._options).render()
      return
    }

    const cardInstallmentForm = new CardInstallmentForm(this._$container, this._options)
    await cardInstallmentForm.render()
  }

  _renderInputAmount() {
    const $inputAmount = this._$container.find(`#${Selector.INPUT_AMOUNT}`)
    const inputAmountPartial = new InputAmountPartial($inputAmount, this._options)
    inputAmountPartial.disabled(!this._options.payment.amountEditable)
    inputAmountPartial.render()
  }

  _renderPayMethodIcons() {
    const $payMethods = this._$container.find(`#${Selector.PAY_METHODS}`)
    const payMethodIconsPartial = new PayMethodIconsPartial($payMethods)
    payMethodIconsPartial.render()
  }
}

export default PinpadForm
