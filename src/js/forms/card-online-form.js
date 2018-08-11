import 'node_modules/jquery-mask-plugin/dist/jquery.mask.min.js'
import { NAMESPACE, ClassName, Event } from 'src/js/constants'
import Bins from 'src/js/sdk/bins'
import InputAmountPartial from 'src/js/partials/input-amount-partial'
import PaymentIconsPartial from 'src/js/partials/payment-icons-partial'
import CardInstallmentsForm from './card-installments-form'
import PayMethodForm from './pay-method-form'
import StateValidation from 'src/js/jquery/state-validation'
import Textual from 'src/js/util/textual'

const Selector = {
  BTN_CONTINUE: `${NAMESPACE}_btnContinue`,
  BTN_GO_BACK: `${NAMESPACE}_btnGoBack`,
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
            <input id="${Selector.INPUT_HOLDER_NAME}" type="text" class="form-control" placeholder="Como impresso no cartão">
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
                <input id="${Selector.INPUT_CVV}"  type="password" class="form-control" placeholder="0000">
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
    <button id="${Selector.BTN_CONTINUE}" type="button" class="btn-footer continue">
      <span class="icon-arrow right"></span><br>
      <span>Continuar</span>
    </button>
  </div>
`;

class CardOnlineForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
    this._options.payment.card = options.payment.card || {}
  }

  _bindButtons() {
    const $btnContinue = this._$container.find(`#${Selector.BTN_CONTINUE}`)
    const $btnGoBack = this._$container.find(`#${Selector.BTN_GO_BACK}`)

    this._state = new StateValidation($btnContinue)
    this._state.update({
      cardNumber: !!this._options.payment.card.number,
      holderName: !!this._options.payment.card.holderName,
      expiryMonth: !!this._options.payment.card.expirationMonth,
      expiryYear: !!this._options.payment.card.expirationYear,
      cvv: !!this._options.payment.card.cvv
    })

    $btnContinue.on(Event.CLICK, () => {
      const cardInstallmentsForm = new CardInstallmentsForm(this._$container, this._options)
      cardInstallmentsForm.render()
    })

    if (this._options.payment.onlyCreditEnabled) {
      $btnGoBack.attr('disabled', true)
      return
    }

    $btnGoBack.on(Event.CLICK, () => {
      const payMethodForm = new PayMethodForm(this._$container, this._options)
      payMethodForm.render()
    })
  }

  _bindInputCardNumber() {
    const $inputCardNumber = this._$container.find(`#${Selector.INPUT_CARD_NUMBER}`)

    $inputCardNumber
      .on('keyup', async () => {
        this._options.payment.card.number = $inputCardNumber.val()

        const bins = new Bins(this._options.token)
        this._options.payment.card.bin = await bins.identify(this._options.payment.card.number)
        this._state.update({ cardNumber: !!this._options.payment.card.bin })

        const cardBrand = this._options.payment.card.bin && this._options.payment.card.bin.cardBrand
        this._paymentIconsPartial.activeIcon(cardBrand)
      })
      .mask("9999999999999000000")
      .val(this._options.payment.card.number)
      .focus()
  }

  _bindInputHolderName() {
    const $inputHolderName = this._$container.find(`#${Selector.INPUT_HOLDER_NAME}`)

    $inputHolderName
      .on(Event.KEY_UP, () => {
        this._options.payment.card.holderName = $inputHolderName.val()

        const holderName = new Textual(this._options.payment.card.holderName)
        const isValid = !holderName.isNullOrWhiteSpace() && holderName.isProperName()

        this._state.update({ holderName: isValid })
      })
      .val(this._options.payment.card.holderName)
  }

  _bindInputCvv() {
    const $inputCvv = this._$container.find(`#${Selector.INPUT_CVV}`)

    $inputCvv
      .on(Event.KEY_UP, () => {
        this._options.payment.card.cvv = $inputCvv.val()
        this._state.update({ cvv: /^\d{3,4}$/.test(this._options.payment.card.cvv) })
      })
      .mask("9990")
      .val(this._options.payment.card.cvv)
  }

  _bindSelectMonth() {
    const $selectMonth = this._$container.find(`#${Selector.SELECT_MONTH}`)

    for (let month = 1; month <= 12; month++) {
      const $option = $('<option/>').attr('value', month).text(String('0' + month).substr(-2))
      $selectMonth.append($option)

      if (this._options.payment.card.expirationMonth === month) {
        $option.attr('selected', true)
      }
    }

    $selectMonth.on(Event.CHANGE, () => {
      this._options.payment.card.expirationMonth = Number($selectMonth.val())
      this._state.update({ expiryMonth: !!this._options.payment.card.expirationMonth })
    })
  }

  _bindSelectYear() {
    const $selectYear = this._$container.find(`#${Selector.SELECT_YEAR}`)
    const firstYear = new Date().getFullYear() - 1
    const lastYear = firstYear + 20

    for (let year = firstYear; year < lastYear; year++) {
      const $option = $('<option/>').attr('value', year).text(String(year).slice(-2))
      $selectYear.append($option)

      if (this._options.payment.card.expirationYear === year) {
        $option.attr('selected', true)
      }
    }

    $selectYear.on(Event.CHANGE, () => {
      this._options.payment.card.expirationYear = Number($selectYear.val())
      this._state.update({ expiryYear: !!this._options.payment.card.expirationYear })
    })
  }

  _renderFooter() {
    const $inputAmount = this._$container.find(`#${Selector.INPUT_AMOUNT}`)
    this._inputAmountPartial = new InputAmountPartial($inputAmount, this._options)
    this._inputAmountPartial.disabled(!this._options.payment.onlyCreditEnabled)
    this._inputAmountPartial.render()

    const $payMethods = this._$container.find(`#${Selector.PAY_METHODS}`)
    this._paymentIconsPartial = new PaymentIconsPartial($payMethods)
    this._paymentIconsPartial.render()
    this._paymentIconsPartial.activeIcon(this._options.payment.card.bin && this._options.payment.card.bin.cardBrand)
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
