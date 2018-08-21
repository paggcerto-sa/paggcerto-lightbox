import { NAMESPACE, ClassName } from '../constants'

const Selector = {
  BTN_TRY_AGAIN: `${NAMESPACE}_btnTryAgain`,
  FORM_BUTTONS: `${NAMESPACE}_formButtons`,
  PRIMARY_MESSAGE: `${NAMESPACE}_primaryMessage`,
  SECONDARY_MESSAGE: `${NAMESPACE}_secondaryMessage`
}

const VIEW = `
  <div class="${ClassName.BODY}">
    <div class="row">
      <div class="col border-right py-6">
        <div class="form-group text-center">
          <div class="form-circle form-circle-danger mx-auto">
            <span class="icon-mark exclamation"></span>
          </div>
          <h5 id="${Selector.PRIMARY_MESSAGE}" class="mb-4">
            <!-- primary message -->
          </h5>
        </div>
      </div>
      <div class="col py-6">
        <div class="ml-auto w-75">
          <h5 id="${Selector.SECONDARY_MESSAGE}" class="text-secondary text-right mb-5">
            <!-- secondary message -->
          </h5>
          <div id="${Selector.FORM_BUTTONS}" class="form-group d-none">
            <!--
              <button id="${Selector.BTN_TRY_AGAIN}" type="button" class="btn btn-outline-primary w-100">
                Tentar novamente
              </button>
            -->
          </div>
        </div>
      </div>
    </div>
  </div>
`

export class ErrorForm {

  constructor($container) {
    this._$container = $container
  }

  render(config) {

    this._$container.html(VIEW)

    config = config || null

    if (config === null) return

    if ('buttons' in config && config.buttons.length > 0) {

      this._$container
        .find(`#${Selector.FORM_BUTTONS}`)
        .removeClass('d-none')

      for (let button of config.buttons) {
        this._createButton(button)
      }
    }

    this._$container.find(`#${Selector.PRIMARY_MESSAGE}`).text(config.primaryMessage)
    this._$container.find(`#${Selector.SECONDARY_MESSAGE}`).text(config.secondaryMessage)
  }

  _createButton(button) {

    const $button = $('<button>')
      .addClass(button.className || 'btn btn-outline-primary w-100')
      .text(button.label || '')
      .on('click', button.onClick || (() => {}))

    this._$container
      .find(`#${Selector.FORM_BUTTONS}`)
      .append($button)
  }
}

export default ErrorForm
