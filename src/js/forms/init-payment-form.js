import Bins from 'src/js/sdk/bins'
import PayMethodForm from './pay-method-form'
import PayMethodIconsPartial from 'src/js/partials/pay-method-icons-partial'
import UnauthorizedForm from './unauthorized-form'
import { NAMESPACE, ClassName } from 'src/js/constants'

const Selector = {
  PAY_METHODS: `${NAMESPACE}_payMethods`
}

const VIEW = `
  <div class="${ClassName.HEADER}">
    Iniciando o pagamento...
  </div>
  <div class="${ClassName.BODY}">
    <div class="row">
      <div class="col py-6">
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

class InitPaymentForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
  }

  async _tryLoadAcceptedBins() {
    this._options.payment.bins = new Bins(this._options)
    await this._options.payment.bins.list()
  }

  _renderPayMethodForm() {
    const payMethodForm = new PayMethodForm(this._$container, this._options)
    payMethodForm.render()
  }

  _renderPayMethodIcons() {
    const $payMethods = this._$container.find(`#${Selector.PAY_METHODS}`)
    this._payMethodIconsPartial = new PayMethodIconsPartial($payMethods)
    this._payMethodIconsPartial.render()
  }

  _renderUnauthorizedForm() {
    const unauthorizedForm = new UnauthorizedForm(this._$container)
    unauthorizedForm.render()
  }

  async render() {
    this._$container.html(VIEW)
    this._renderPayMethodIcons()

    try {
      await this._tryLoadAcceptedBins()
      this._renderPayMethodForm()
    } catch (e) {
      this._renderUnauthorizedForm()
    }
  }
}

export default InitPaymentForm
