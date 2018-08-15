import $ from 'node_modules/jquery'
import Bins from './sdk/bins'
import InitPaymentForm from './forms/init-payment-form'
import { ID, ClassName, Delay, EventName } from './constants'

const VIEW = `
  <div id="${ID}">
    <div class="${ClassName.BACKDROP}"></div>
    <div class="${ClassName.DIALOG}">
      <button type="button" class="${ClassName.BTN_CLOSE}"></button>
      <div class="${ClassName.CONTENT}"></div>
      <a href="https://www.paggcerto.com.br/" target="_blank">
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

    await this._renderInitPayMmentForm()
  }
}

export default Lightbox
