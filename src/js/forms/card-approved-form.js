import 'node_modules/jquery-mask-plugin/dist/jquery.mask.min.js'
import { NAMESPACE, ClassName, EventName } from 'src/js/constants'
import FormState from 'src/js/jquery/form-state'
import PaymentsApi from 'src/js/sdk/payments-api'

const Selector = {
  BTN_SUBMIT_GROUP: `${NAMESPACE}_btnSubmitGroup`,
  INPUT_EMAIL: `${NAMESPACE}_receipt-email`,
  INPUT_MOBILE: `${NAMESPACE}_receipt-mobile`
}

const VIEW = `
  <div class="${ClassName.BODY}">
    <div class="row">
      <div class="col border-right py-6">
        <div class="form-group text-center">
          <div class="form-circle form-circle-primary mx-auto">
            <span class="icon-mark check"></span>
          </div>
          <h5 class="text-primary">
            Transação aprovada!
          </h5>
        </div>
      </div>
      <div class="col py-6">
        <form class="ml-auto w-75" novalidate>
          <h5 class="text-secondary text-right mb-5">
            Enviar comprovante por e-mail e/ou SMS:
          </h5>
          <div class="form-group">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">@</span>
              </div>
              <input id="${Selector.INPUT_EMAIL}" type="text" class="form-control" placeholder="Endereço de e-mail">
            </div>
          </div>
          <div class="form-group">
            <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">&#9993;</span>
                </div>
              <input id="${Selector.INPUT_MOBILE}" type="text" class="form-control" placeholder="Número do celular">
            </div>
          </div>
          <div id="${Selector.BTN_SUBMIT_GROUP}" class="form-group d-flex">
            <button type="submit" class="btn btn-primary ml-auto px-5">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
`

const VIEW_SENDING = `
  <div class="form-group text-right text-primary">
    <i>Enviando...</i>
  </div>
`

const VIEW_SENDING_COMPLETE = `
  <div class="form-group text-right text-primary">
    Enviado
  </div>
`

const VIEW_SENDING_ERROR = `
  <div class="form-group text-right text-danger">
    Falha no envio
  </div>
`

const EmailRegex = /^$|^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
const MobileRegex = /^$|^\(79\) 9\d{4}-\d{4}$/

class CardApprovedForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
  }

  _bindInputEmail() {
    this._$inputEmail = this._$container.find(`#${Selector.INPUT_EMAIL}`)

    this._$inputEmail.on(EventName.KEY_UP, () => {
      this._email = this._$inputEmail.val()
      this._isValidEmail = EmailRegex.test(this._email)
      this._updateFormState()
    })
  }

  _bindInputMobile() {
    this._$inputMobile = this._$container.find(`#${Selector.INPUT_MOBILE}`)

    this._$inputMobile
      .on(EventName.KEY_UP, () => {
        this._mobile = this._$inputMobile.val()
        this._isValidMobile = MobileRegex.test(this._mobile)
        this._updateFormState()
      })
      .mask('(99) 99999-9999')
  }

  _loadFormState() {
    this._formState = new FormState(this._$form)
    this._formState.update({ contact: false })
    this._isValidEmail = false
    this._isValidMobile = false
  }

  _updateFormState() {
    this._formState.update({
      contact: this._isValidEmail && this._isValidMobile
    })
  }

  _bindForm() {
    this._$form = this._$container.find('form')

    this._$form.on(EventName.SUBMIT, async () => {
      if (this._formState.invalid) return
      await this._send()
    })
  }

  async _send() {
    const paymentsApi = new PaymentsApi(this._options)
    const nsu = this._options.processedPayment.cardTransactions[0].nsu
    const contact = { email: this._email, mobile: this._mobile }
    const $btnSubmitGroup = this._$container.find(`#${Selector.BTN_SUBMIT_GROUP}`)
    const $sendingText = $(VIEW_SENDING)

    this._$inputEmail.attr('disabled', true)
    this._$inputMobile.attr('disabled', true)

    $btnSubmitGroup.replaceWith($sendingText)

    try {
      await paymentsApi.sendCardReceipt(nsu, contact)
      $sendingText.replaceWith($(VIEW_SENDING_COMPLETE))
    } catch (e) {
      $sendingText.replaceWith($(VIEW_SENDING_ERROR))
    }
  }

  async render() {
    this._$container.html(VIEW)

    this._bindInputEmail()
    this._bindInputMobile()
    this._bindForm()
    this._loadFormState()
  }
}

export default CardApprovedForm
