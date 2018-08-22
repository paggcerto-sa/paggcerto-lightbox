import 'jquery-mask-plugin/dist/jquery.mask.min.js'
import FormState from '../jquery/form-state'
import PaymentsApi from '../sdk/payments-api'
import { NAMESPACE, ClassName, EventName } from '../constants'

const Selector = {
  GROUP_SUBMIT: `${NAMESPACE}_groupSubmit`,
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
          <h5 class="mb-4">
            Transação aprovada!
          </h5>
        </div>
      </div>
      <div class="col py-6">
        <form class="ml-auto w-75" novalidate>
          <h5 class="text-secondary text-right mb-5">
            Enviar comprovante por <span class="text-nowrap">e-mail</span> e/ou SMS:
          </h5>
          <div class="form-group">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">@</span>
              </div>
              <input id="${Selector.INPUT_EMAIL}" type="text" class="form-control" placeholder="Endereço de e-mail" maxlength="120">
            </div>
          </div>
          <div class="form-group">
            <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">&#9993;</span>
                </div>
              <input id="${Selector.INPUT_MOBILE}" type="text" class="form-control" placeholder="Número do celular" maxlength="15">
            </div>
          </div>
          <div id="${Selector.GROUP_SUBMIT}" class="form-group d-flex">
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

  async render() {
    this._$container.html(VIEW)

    this._assignInitialValues();
    this._bindInputEmail()
    this._bindInputMobile()
    this._bindForm()
    this._updateFormState()
  }

  _assignInitialValues() {
    this._email = ''
    this._mobile = ''
  }

  _bindForm() {
    this._$form = this._$container.find('form')

    this._$form.on(EventName.SUBMIT, async () => {
      if (this._formState.invalid) return
      await this._send()
    })
  }

  _bindInputEmail() {
    this._$inputEmail = this._$container.find(`#${Selector.INPUT_EMAIL}`)

    this._$inputEmail.on(EventName.KEY_UP, () => {
      this._email = this._$inputEmail.val()
      this._updateFormState()
    })
  }

  _bindInputMobile() {
    this._$inputMobile = this._$container.find(`#${Selector.INPUT_MOBILE}`)

    this._$inputMobile
      .on(EventName.KEY_UP, () => {
        this._mobile = this._$inputMobile.val()
        this._updateFormState()
      })
      .mask('(99) 99999-9999')
  }

  _updateFormState() {
    const hasEmailOrMobile = !!this._email || !!this._mobile

    this._isValidEmail = EmailRegex.test(this._email)
    this._isValidMobile = MobileRegex.test(this._mobile)

    this._formState = this._formState || new FormState(this._$container)
    this._formState.update({
      contact: {
        valid: hasEmailOrMobile && this._isValidEmail && this._isValidMobile,
        message: 'Titular do cartão é obrigatório e permite somente letras.'
      }
    })
  }

  async _send() {
    const paymentsApi = new PaymentsApi(this._options)
    const nsu = this._options.processedPayment.cardTransactions[0].nsu
    const contact = { email: this._email, mobile: this._mobile }
    const $groupSubmit = this._$container.find(`#${Selector.GROUP_SUBMIT}`)
    const $sendingText = $(VIEW_SENDING)

    this._$inputEmail.attr('disabled', true)
    this._$inputMobile.attr('disabled', true)

    $groupSubmit.replaceWith($sendingText)

    try {
      await paymentsApi.sendCardReceipt(nsu, contact)
      $sendingText.replaceWith($(VIEW_SENDING_COMPLETE))
    } catch (e) {
      $sendingText.replaceWith($(VIEW_SENDING_ERROR))
    }
  }
}

export default CardApprovedForm
