import CardProcessingForm from './card-processing-form'
import { NAMESPACE, ClassName, EventName } from '../constants'
import InitPaymentForm from './init-payment-form';

const Selector = {
  BTN_TRY_AGAIN: `${NAMESPACE}_btnTryAgain`
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
            O processamento falhou.
          </h5>
        </div>
      </div>
      <div class="col py-6">
        <div class="ml-auto w-75">
          <h5 class="text-secondary text-right mb-5">
            Por favor contate a equipe responsável ou tente novamente.
          </h5>
          <div class="form-group">
            <button id="${Selector.BTN_TRY_AGAIN}" type="button" class="btn btn-outline-primary w-100">
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
`

class CardErrorForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
    this._router = null
  }

  async render(router) {
    this._router = router
    this._$container.html(VIEW)
    this._bindButtons()
  }

  _bindButtons() {
    const $btnTryAgain = this._$container.find(`#${Selector.BTN_TRY_AGAIN}`)

    $btnTryAgain.on(EventName.CLICK, () => {
      if (this._options.pinpad === null) {
        this._router.render(CardProcessingForm, this._$container, this._options)
      } else {
        this._router.render(InitPaymentForm, this._$container, this._options)
      }
    })
  }
}

export default CardErrorForm
