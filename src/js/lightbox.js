import $ from 'node_modules/jquery'
import { ID, ClassName, Event } from './constants'
import PayMethodForm from 'src/js/forms/pay-method-form'

const VIEW = `
  <div id="${ID}">
    <div class="${ClassName.BACKDROP}"></div>
    <div class="${ClassName.DIALOG}">
      <button type="button" class="${ClassName.BTN_CLOSE}"></button>
      <div class="${ClassName.CONTENT}"></div>
      <span class="icon-logo"></span>
    </div>
  </div>
`

class Lightbox {
  constructor(options, store) {
    this._options = options
    this._store = store
  }

  show() {
    if (this._options.payment.allMethodsDisabled) return

    const $body = $('body').append(VIEW)
    const $lightbox = $body.find(`#${ID}`)
    const $lightboxContent = $lightbox.find(`.${ClassName.CONTENT}`)
    const $closeButton = $lightbox.find(`.${ClassName.DIALOG} .${ClassName.BTN_CLOSE}`)
    const payMethodForm = new PayMethodForm($lightboxContent, this._options, this._store)

    $closeButton.on(Event.CLICK, () => {
      $body.removeClass(`${ClassName.SHOW}`)
      setTimeout(() => $lightbox.remove(), 100)
    })

    payMethodForm.render()

    // Used for transition run properly after append VIEW to DOM
    setTimeout(() => { $body.addClass(`${ClassName.SHOW}`) }, 50)
  }
}

export default Lightbox
