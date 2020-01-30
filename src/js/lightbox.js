import $ from 'jquery'
import Bins from './sdk/bins'
import InitPaymentForm from './forms/init-payment-form'
import { ID, ClassName, Delay, EventName } from './constants'
import LightboxRouter from './lightbox-router'

const VIEW = `
  <div id="${ID}">
    <div class="${ClassName.BACKDROP}"></div>
    <div class="${ClassName.DIALOG}">
      <button type="button" class="${ClassName.BTN_CLOSE}"></button>
      <div class="${ClassName.CONTENT}"></div>
      <a>
        <span class="security-ambient"><i class="icon-shield"></i> Ambiente Seguro</span>
      </a>
      <div class="icon-proccessed">Processado pela</div>
      <a href="https://www.pagcerto.com.br/" target="_blank">
      <span class="icon-logo"></span>
      </a>
    </div>
  </div>
`

class Lightbox {
  constructor(options) {
    this._options = options
  }

  async _tryLoadAcceptedBins() {
    this._options.payment.bins = new Bins(this._options)
    await this._options.payment.bins.list()
  }

  _animate() {
    // Used for transition run properly after append VIEW to DOM
    setTimeout(() => { this._$body.addClass(`${ClassName.SHOW}`) }, Delay.LIGHTBOX_SHOW_ANIMATION)
  }

  _bindButtons() {
    const $closeButton = this._$lightbox.find(`.${ClassName.DIALOG} .${ClassName.BTN_CLOSE}`)

    $closeButton.on(EventName.CLICK, () => {

      if (this._options.pinpad !== null) {
        this._options.pinpad.close()
        this._options.pinpad = null
      }

      this._$body.removeClass(`${ClassName.SHOW}`)
      setTimeout(() => this._$lightbox.remove(), 100)
    })
  }

  async _renderInitPayMmentForm() {
    const initPaymentForm = new InitPaymentForm(this._$container, this._options)
    await initPaymentForm.render()
  }

  async initialize() {
    if (this._options.payment.allMethodsDisabled) return

    this._$body = $('body').append(VIEW)
    this._$lightbox = this._$body.find(`#${ID}`)
    this._$container = this._$lightbox.find(`.${ClassName.CONTENT}`)

    this._$lightbox.on(EventName.DRAG_DROP, (e) => e.preventDefault())

    this._animate()
    this._bindButtons()

    const router = new LightboxRouter()
    router.render(InitPaymentForm, this._$container, this._options)
  }
}

export default Lightbox
