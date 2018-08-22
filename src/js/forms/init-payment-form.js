import Bins from '../sdk/bins'
import PayMethodForm from './pay-method-form'
import PayMethodIconsPartial from '../partials/pay-method-icons-partial'
import UnauthorizedForm from './unauthorized-form'
import PinpadService from '../sdk/pinpad-service'
import { NAMESPACE, ClassName } from '../constants'

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
    this._options.pinpad = null
    this._router = null
  }

  async _tryLoadAcceptedBins() {
    this._options.payment.bins = new Bins(this._options)
    await this._options.payment.bins.list()
  }

  _renderPayMethodIcons() {
    const $payMethods = this._$container.find(`#${Selector.PAY_METHODS}`)
    this._payMethodIconsPartial = new PayMethodIconsPartial($payMethods)
    this._payMethodIconsPartial.render()
  }

  _renderPayMethodForm() {
    this._router.render(PayMethodForm, this._$container, this._options)
  }

  _renderUnauthorizedForm() {
    this._router.render(UnauthorizedForm, this._$container)
  }

  async render(lightboxRouter) {

    console.log('Rendering InitPaymentForm')

    this._router = lightboxRouter

    this._$container.html(VIEW)
    this._renderPayMethodIcons()

    try {

      await this._tryLoadAcceptedBins()

      const pinpad = new PinpadService()

      if (await pinpad.connect()) {

        const devices = await pinpad.listDevices()

        if (devices !== null && devices.length > 0) {

          if (this._options.pinpad !== null) {
            this._options.pinpad.close()
          }

          this._options.pinpad = pinpad

        } else {
          pinpad.close()
        }
      }

      this._renderPayMethodForm()
    } catch (e) {
      this._renderUnauthorizedForm()
    }

    console.log('Rendered: Initial Payment')
  }
}

export default InitPaymentForm
