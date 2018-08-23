import CardOnlineForm from './card-online-form'
import CardProcessingForm from './card-processing-form'
import FormState from '../jquery/form-state'
import InputAmountPartial from '../partials/input-amount-partial'
import InstallmentOptionsPartial from '../partials/installment-options-partial'
import PayMethodIconsPartial from '../partials/pay-method-icons-partial'
import PinpadProcessingForm from './pinpad-processing-form'
import { NAMESPACE, ClassName, EventName } from '../constants'
import { ResolvablePromise } from '../util/async';

const Selector = {
  BTN_GO_BACK: `${NAMESPACE}_btnGoBack`,
  INPUT_AMOUNT: `${NAMESPACE}_inputAmount`,
  INSTALLMENT_OPTIONS: `${NAMESPACE}_installments`,
  PAY_METHODS: `${NAMESPACE}_payMethods`
}

const VIEW = `
  <form novalidate>
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
      <button type="submit" class="btn-footer continue">
        <span class="icon-arrow right"></span><br>
        <span>Finalizar</span>
      </button>
    </div>
  </form>
`

class CardInstallmentsForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
    this._router = null
  }

  _bindButtons() {
    const $btnGoBack = this._$container.find(`#${Selector.BTN_GO_BACK}`)

    $btnGoBack.on(EventName.CLICK, () => this._goBack())
  }

  _bindForm() {

    this._$form = this._$container.find('form')

    this._$form.on(EventName.SUBMIT, () => {

      if (this._formState.invalid) return

      if (this._options.pinpad === null || this._options.payment.redirected) {
        this._goTo(CardProcessingForm)
      } else {
        this._goTo(PinpadProcessingForm)
      }
    })
  }

  _bindInstallments() {
    const $installmentOptions = this._$container.find(`#${Selector.INSTALLMENT_OPTIONS}`)
    this._installmentOptionsPartial = new InstallmentOptionsPartial($installmentOptions, this._options)
    this._installmentOptionsPartial.render()
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

  _setFormState() {
    this._formState = new FormState(this._$form)
  }

  async render(router) {
    this._router = router
    this._$container.html(VIEW)
    this._bindButtons()
    this._bindForm()
    this._bindInstallments()
    this._renderInputAmount()
    this._renderPayMethodIcons()
    this._setFormState()
  }

  _goTo(form) {
    this._router.render(form, this._$container, this._options)
  }

  _goBack() {
    if (this._options.pinpad === null) {
      this._router.goBack(1)
    }
    else {
      this._router.goBack(2)
    }
  }
}

export default CardInstallmentsForm
