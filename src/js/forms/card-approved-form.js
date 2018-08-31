import 'jquery-mask-plugin/dist/jquery.mask.min.js'
import FormState from '../jquery/form-state'
import PaymentsApi from '../sdk/payments-api'
import AccountApi from "../sdk/account-api"
import { NAMESPACE, ClassName, EventName, MaskMoney } from "../constants"
import HTMLRECEIPT from '../receipt'
import moment from 'moment'
import Currency from '../util/currency'

const Selector = {
  GROUP_SUBMIT: `${NAMESPACE}_groupSubmit`,
  INPUT_EMAIL: `${NAMESPACE}_receipt-email`,
  INPUT_MOBILE: `${NAMESPACE}_receipt-mobile`,
  BUTTON_RECEIPT: `${NAMESPACE}_receipt-printed`
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
          <div id="${Selector.BUTTON_RECEIPT}" class="form-group d-flex">
            <button type="button" class="btn btn-outline-primary">
            <i class="icon-printer icons"></i> Imprimir Comprovante
            </button>
          </div>
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
    await this._presets()
    this._$container.html(VIEW)

    this._assignInitialValues()
    this._bindInputEmail()
    this._bindInputMobile()
    this._bindButtonReciept()
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

  _bindButtonReciept() {
    this._$buttonReceipt = this._$container.find(`#${Selector.BUTTON_RECEIPT}`)

    this.HTMLRECEIPT = HTMLRECEIPT.replace("[[CARDBRAND]]", this._options.processedPayment.cardTransactions[0].cardBrand)
    this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[CARDFINAL]]", this._options.processedPayment.cardTransactions[0].cardFinal)
    this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[DATA]]", moment(this._options.processedPayment.cardTransactions[0].paidAt).format("DD/MM/YYYY"))
    this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[NSU]]", this._options.processedPayment.cardTransactions[0].nsu)
    this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[TRADENAME]]", this._options.presets.holder.company.tradeName)
    this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[TAXDOCUMENT]]", this._options.presets.holder.company.taxDocument)
    this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[CITY]]", this._options.presets.address.city.name)
    this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[STATE]]", this._options.presets.address.city.state)
    this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[LINE1]]", this._options.presets.address.line1)
    this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[STREETNUMBER]]", this._options.presets.address.streetNumber)
    this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[AMOUNTPAID]]", new Currency(this._options.processedPayment.cardTransactions[0].amountPaid).asString())
    this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[INSTALLMENTS]]", this._options.processedPayment.cardTransactions[0].installments)
    this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[INSTALLMENTVALUE]]", new Currency(this._options.processedPayment.cardTransactions[0].installmentValue).asString())

    if (this._options.processedPayment.cardTransactions[0].credit) {
      this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[METHODPAYMENT]]", "Crédito")
    }

    if (this._options.processedPayment.cardTransactions[0].online) {
      this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[VISIBLE]]", "none")
      this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[VISIBLE-ASS]]", "block")
    }

    this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[VISIBLE]]", "block")
    this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[VISIBLE-ASS]]", "none")
    this.HTMLRECEIPT = this.HTMLRECEIPT.replace("[[METHODPAYMENT]]", "Débito")

    this._$buttonReceipt.on(EventName.CLICK, () => {
      const receiptWindow = window.open("", "_blank")
      receiptWindow.document.write(this.HTMLRECEIPT)
      setTimeout(() => {
        receiptWindow.print()
      }, 300)
    })
  }

  async _presets() {
    const accountApi = new AccountApi(this._options)
    this._options.presets = await accountApi.presets()
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
