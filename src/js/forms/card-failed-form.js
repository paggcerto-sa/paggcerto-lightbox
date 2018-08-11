import { NAMESPACE, ClassName, Event } from 'src/js/constants'
import CardOnlineForm from './card-online-form'
import PayMethodForm from './pay-method-form'

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
          <h5 class="text-danger">
            Transação não autorizada.
          </h5>
        </div>
      </div>
      <div class="col py-6">
        <div class="ml-auto w-75">
          <h5 class="text-secondary text-right mb-5">
            O pagamento não foi concluído. O que deseja fazer?
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
`;

class CardFailedForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
  }

  _bindButtons() {
    const $btnTryAnotherCard = this._$container.find(`#${Selector.BTN_TRY_ANOTHER_CARD}`)
    const $_btnTryAnotherMethod = this._$container.find(`#${Selector.BTN_TRY_ANOTHER_METHOD}`)

    $btnTryAnotherCard.on(Event.CLICK, () => {
      const cardOnlineForm = new CardOnlineForm(this._$container, this._options)
      cardOnlineForm.render()
    })

    $_btnTryAnotherMethod.on(Event.CLICK, () => {
      const payMethodForm = new PayMethodForm(this._$container, this._options)
      payMethodForm.render()
    })
  }

  _resetOptions() {
    this._options.payment.card = null
  }

  render() {
    this._$container.html(VIEW)
    this._bindButtons()
    this._resetOptions()
  }
}

export default CardFailedForm
