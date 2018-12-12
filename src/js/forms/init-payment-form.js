import { NAMESPACE, ClassName } from '../constants'
import Bins from '../sdk/bins'
import PayMethodForm from './pay-method-form'
import PayMethodIconsPartial from '../partials/pay-method-icons-partial'
import PinpadService from '../sdk/pinpad-service'
import UnauthorizedForm from './unauthorized-form'
import ErrorOptionsForm from "./error-options-form";

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
    this._options.pinpad = this._options.pinpad || null
    this._options.payment.redirected = false
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

  _renderErrorOptionsForm () {
    this._router.render(ErrorOptionsForm, this._$container, this._options)
  }

  async render(router) {
    this._router = router
    this._$container.html(VIEW)
    this._renderPayMethodIcons()

    if (this._options.errors.length > 0) {
      this._renderErrorOptionsForm()
      return
    }

    try {

      await this._tryLoadAcceptedBins()

      if (this._options.pinpad !== null) {
        await this._options.pinpad.close()
        this._options.pinpad = null
      }

      if (this._options.payment.deviceEnabled) {
        const pinpad = new PinpadService(this._options)

        if (await pinpad.connect()) {
          const devices = await pinpad.listDevices()

          if (devices !== null && devices.length > 0) {
            this._options.pinpad = pinpad;
          } else {
            await pinpad.close();
          }
        }
      }

      this._renderPayMethodForm()
    } catch (e) {
      console.error(e)
      this._renderUnauthorizedForm()
    }
  }
}

export default InitPaymentForm
