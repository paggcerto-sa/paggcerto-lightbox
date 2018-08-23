import CardOnlineForm from './card-online-form'
import PayMethodForm from './pay-method-form'
import { NAMESPACE, ClassName, EventName } from '../constants'
import InitPaymentForm from './init-payment-form';
import { PinpadForm } from './pinpad-form';

const Selector = {
  BTN_TRY_ANOTHER_CARD: `${NAMESPACE}_btnTryAnotherCard`,
  BTN_TRY_ANOTHER_METHOD: `${NAMESPACE}_btnTryAnotherMethod`,
}

const VIEW = `
  <div class="${ClassName.BODY}">
    <div class="row">
      <div class="col border-right py-6">
        <div class="form-group text-center">
          <div class="form-circle form-circle-danger mx-auto">
            <span class="icon-mark exclamation"></span>
          </div>
          <h5 class="mb-4">
            Transação não autorizada.
          </h5>
        </div>
      </div>
      <div class="col py-6">
        <div class="ml-auto w-75">
          <h5 class="text-secondary text-right mb-5">
            O pagamento não pôde ser concluído. O que deseja fazer?
          </h5>
          <div class="form-group">
            <button id="${Selector.BTN_TRY_ANOTHER_CARD}" type="button" class="btn btn-outline-primary w-100">
              Tentar outro cartão
            </button>
          </div>
          <div class="form-group">
            <button id="${Selector.BTN_TRY_ANOTHER_METHOD}" type="button" class="btn btn-outline-primary w-100">
              Tentar outra forma de pagamento
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
`

class CardReprovedForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
    this._router = null
  }

  _bindButtons() {
    const $btnTryAnotherCard = this._$container.find(`#${Selector.BTN_TRY_ANOTHER_CARD}`)
    const $_btnTryAnotherMethod = this._$container.find(`#${Selector.BTN_TRY_ANOTHER_METHOD}`)

    $btnTryAnotherCard.on(EventName.CLICK, () => {
      this._goTo(CardOnlineForm)
      if (this._options.pinpad !== null) {
        this._goTo(PinpadForm)
      } else {
        this._goTo(CardOnlineForm)
      }
    })

    $_btnTryAnotherMethod.on(EventName.CLICK, () => {
      if (this._options.pinpad !== null) {
        this._goTo(InitPaymentForm)
      } else {
        this._goTo(PayMethodForm)
      }
    })
  }

  _resetCard() {
    this._options.payment.card = null
  }

  render(router) {
    this._router = router
    this._$container.html(VIEW)
    this._bindButtons()
    this._resetCard()
  }

  _goTo(form) {
    this._router.render(form, this._$container, this._options)
  }
}

export default CardReprovedForm
