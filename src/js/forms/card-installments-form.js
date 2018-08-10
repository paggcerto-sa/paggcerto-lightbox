import { NAMESPACE, ClassName, Event } from 'src/js/constants'
import CardOnlineForm from './card-online-form'
import InputAmountPartial from 'src/js/partials/input-amount-partial'
import InstallmentOptionsPartial from 'src/js/partials/installment-options-partial'
import PaymentIconsPartial from 'src/js/partials/payment-icons-partial'

const Selector = {
  BTN_CONTINUE: `${NAMESPACE}_btnContinue`,
  BTN_GO_BACK: `${NAMESPACE}_btnGoBack`,
  INPUT_AMOUNT: `${NAMESPACE}_inputAmount`,
  INSTALLMENT_OPTIONS: `${NAMESPACE}_installments`,
  PAY_METHODS: `${NAMESPACE}_payMethods`
}

const VIEW = `
  <div class="${ClassName.HEADER}">
    Escolha a forma de parcelamento:
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
        <span id="${Selector.INSTALLMENT_OPTIONS}"></span>
      </div>
    </div>
  </div>
  <div class="${ClassName.FOOTER} text-center">
    <button id="${Selector.BTN_GO_BACK}" type="button" class="btn-footer go-back">
      <span class="icon-arrow left"></span><br>
      <span>Voltar</span>
    </button>
    <span id="${Selector.PAY_METHODS}"></span>
    <button id="${Selector.BTN_CONTINUE}" type="button" class="btn-footer continue">
      <span class="icon-arrow right"></span><br>
      <span>Finalizar</span>
    </button>
  </div>
`;

class CardInstallmentsForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
  }

  _bindButtons() {
    const $btnContinue = this._$container.find(`#${Selector.BTN_CONTINUE}`)
    const $btnGoBack = this._$container.find(`#${Selector.BTN_GO_BACK}`)

    $btnContinue.on(Event.CLICK, () => {
      // TODO
    })

    $btnGoBack.on(Event.CLICK, () => {
      const cardOnlineForm = new CardOnlineForm(this._$container, this._options)
      cardOnlineForm.render()
    })
  }

  _bindInstallments() {
    const $installmentOptions = this._$container.find(`#${Selector.INSTALLMENT_OPTIONS}`)
    this._installmentOptionsPartial = new InstallmentOptionsPartial($installmentOptions, this._options)
    this._installmentOptionsPartial.render()
  }

  _renderFooter() {
    const $inputAmount = this._$container.find(`#${Selector.INPUT_AMOUNT}`)
    this._inputAmountPartial = new InputAmountPartial($inputAmount, this._options)
    this._inputAmountPartial.disabled(true)
    this._inputAmountPartial.render()

    const $payMethods = this._$container.find(`#${Selector.PAY_METHODS}`)
    this._paymentIconsPartial = new PaymentIconsPartial($payMethods)
    this._paymentIconsPartial.render()
    this._paymentIconsPartial.activeIcon(this._options.payment.card.bin.cardBrand)
  }

  render() {
    this._$container.html(VIEW)

    this._bindButtons();
    this._bindInstallments();

    this._renderFooter()
  }
}

export default CardInstallmentsForm
