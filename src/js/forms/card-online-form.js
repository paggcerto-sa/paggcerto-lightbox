import 'node_modules/jquery-mask-plugin/dist/jquery.mask.min.js'
import { NAMESPACE, ClassName, Event } from 'src/js/constants'
import Bins from 'src/js/sdk/bins'
import InputAmountPartial from 'src/js/partials/input-amount-partial'
import PaymentIconsPartial from 'src/js/partials/payment-icons-partial'
import PayMethodForm from './pay-method-form'
import StateValidation from 'src/js/jquery/state-validation'
import Textual from 'src/js/util/textual'

const Selector = {
  BTN_GO_BACK: `${NAMESPACE}_btnGoBack`,
  BTN_CONFIRM: `${NAMESPACE}_btnConfirm`,
  INPUT_AMOUNT: `${NAMESPACE}_inputAmount`,
  INPUT_CARD_NUMBER: `${NAMESPACE}_inputCardNumber`,
  INPUT_HOLDER_NAME: `${NAMESPACE}_inputHolderName`,
  INPUT_CVV: `${NAMESPACE}_inputCvv`,
  PAY_METHODS: `${NAMESPACE}_payMethods`,
  SELECT_MONTH: `${NAMESPACE}_selectMonth`,
  SELECT_YEAR: `${NAMESPACE}_selectYear`
}

const VIEW = `
  <div class="${ClassName.HEADER}">
    Insira os dados do cartão:
  </div>
  <div class="${ClassName.BODY}">
    <div class="row">
      <div class="col border-right">
        <div class="form-group text-center">
          <span id="${Selector.INPUT_AMOUNT}"></span>
          <span class="pay-method-text">Crédito</span>
        </div>
      </div>
      <div class="col">
        <div>
          <div class="form-group">
            <label>Número do cartão:</label>
            <input id="${Selector.INPUT_CARD_NUMBER}" type="text" class="form-control" placeholder="0000 0000 0000 0000">
          </div>
          <div class="form-group">
            <label>Nome do titular do cartão:</label>
            <input id="${Selector.INPUT_HOLDER_NAME}" type="text" class="form-control text-uppercase" placeholder="Como impresso no cartão">
          </div>
          <div class="row">
            <div class="col-8">
              <div class="form-group">
                <label>Validade:</label>
                <div>
                  <select id="${Selector.SELECT_MONTH}" class="form-control d-inline w-45">
                    <option>MM</option>
                  </select>
                  <select id="${Selector.SELECT_YEAR}" class="form-control d-inline w-45">
                    <option>AA</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-4">
              <div class="form-group">
                <label>CVV:</label>
                <input id="${Selector.INPUT_CVV}"  type="text" class="form-control" placeholder="0000">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="${ClassName.FOOTER} text-center">
    <button id="${Selector.BTN_GO_BACK}" type="button" class="btn-footer go-back">
      <span class="icon-arrow left"></span><br>
      <span>Voltar</span>
    </button>
    <span id="${Selector.PAY_METHODS}"></span>
    <button id="${Selector.BTN_CONFIRM}" type="button" class="btn-footer continue">
      <span class="icon-arrow right"></span><br>
      <span>Continuar</span>
    </button>
  </div>
`;

class CardOnlineForm {
  constructor($container, options, store) {
    this._$container = $container
    this._options = options
    this._store = store
  }

  _bindButtons() {
    const $btnConfirm = this._$container.find(`#${Selector.BTN_CONFIRM}`)
    const $btnGoBack = this._$container.find(`#${Selector.BTN_GO_BACK}`)

    this._state = new StateValidation($btnConfirm)
    this._state.update({
      cardNumber: false,
      holderName: false,
      expiryMonth: false,
      expiryYear: false,
      cvv: false
    })

    $btnConfirm.on(Event.CLICK, () => {
      // TODO
    })

    if (this._options.payment.onlyCredit) {
      $btnGoBack.attr('disabled', true)
      return
    }

    $btnGoBack.on(Event.CLICK, () => {
      const payMethodForm = new PayMethodForm(this._$container, this._options, this._store)
      payMethodForm.render()
    })
  }

  _bindInputCardNumber() {
    const $inputCardNumber = this._$container.find(`#${Selector.INPUT_CARD_NUMBER}`)

    $inputCardNumber
      .on('keyup', async () => {
        const cardNumber = $inputCardNumber.val()
        const bins = new Bins(this._options.token)

        this._store.bin = await bins.identify(cardNumber)
        this._state.update({ cardNumber: !!this._store.bin })

        const cardBrand = this._store.bin && this._store.bin.cardBrand
        this._paymentIconsPartial.activeIcon(cardBrand)
      })
      .mask("9999999999999000000")
      .focus()
  }

  _bindInputHolderName() {
    const $inputHolderName = this._$container.find(`#${Selector.INPUT_HOLDER_NAME}`)

    $inputHolderName.on(Event.KEY_UP, () => {
      const holderName = $inputHolderName.val()
      const isProperName = new Textual(holderName).isProperName()
      const isValid = holderName && isProperName

      $inputHolderName.toggleClass('has-error', !isValid)
      this._state.update({ holderName: isValid })
    })
  }

  _bindInputCvv() {
    const $inputCvv = this._$container.find(`#${Selector.INPUT_CVV}`)

    $inputCvv
      .on(Event.KEY_UP, () => {
        this._state.update({ cvv: /^\d{3,4}$/.test($inputCvv.val()) })
      })
      .mask("9990")
  }

  _bindSelectMonth() {
    const $selectMonth = this._$container.find(`#${Selector.SELECT_MONTH}`)

    for (let month = 1; month <= 12; month++) {
      $selectMonth.append($('<option/>').attr('value', month).text(String('0' + month).substr(-2)))
    }

    $selectMonth.on(Event.CHANGE, () => {
      this._state.update({ expiryMonth: !!$selectMonth.val() })
    })
  }

  _bindSelectYear() {
    const $selectYear = this._$container.find(`#${Selector.SELECT_YEAR}`)
    const firstYear = new Date().getFullYear() - 1
    const lastYear = firstYear + 20

    for (let year = firstYear; year < lastYear; year++) {
      $selectYear.append($('<option/>').attr('value', year).text(String(year).slice(-2)))
    }

    $selectYear.on(Event.CHANGE, () => {
      this._state.update({ expiryYear: !!$selectYear.val() })
    })
  }

  _renderFooter() {
    const $inputAmount = this._$container.find(`#${Selector.INPUT_AMOUNT}`)
    this._inputAmountPartial = new InputAmountPartial($inputAmount, this._store)
    this._inputAmountPartial.disabled(!this._options.payment.onlyCredit).render()

    const $payMethods = this._$container.find(`#${Selector.PAY_METHODS}`)
    this._paymentIconsPartial = new PaymentIconsPartial($payMethods)
    this._paymentIconsPartial.render()
  }

  render() {
    this._$container.html(VIEW)

    this._bindButtons()
    this._bindInputCardNumber()
    this._bindInputCvv()
    this._bindInputHolderName()
    this._bindSelectMonth()
    this._bindSelectYear()

    this._renderFooter()
  }
}

export default CardOnlineForm
