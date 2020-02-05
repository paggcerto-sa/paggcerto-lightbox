import CardErrorForm from '../forms/card-error-form'
import CardReprovedForm from '../forms/card-reproved-form'
import CardApprovedForm from '../forms/card-approved-form'
import InputAmountPartial from '../partials/input-amount-partial'
import PayMethodIconsPartial from '../partials/pay-method-icons-partial'
import PaymentsApi from '../sdk/payments-api'
import Payment from '../sdk/payment'
import { NAMESPACE, ClassName } from '../constants'
import CardOnlineForm from './card-online-form'
import {
  _isNullOrUndefined,
  _isFunction } from '../../js/util/annotations'

const Selector = {
  INPUT_AMOUNT: `${NAMESPACE}_inputAmount`,
  PAY_METHODS: `${NAMESPACE}_payMethods`,
  PAYMENT_METHOD: `${NAMESPACE}_payMethod`
}

const VIEW = `
  <div class="${ClassName.HEADER}">
    Estamos quase lá!<br>
    Sua transação está sendo processada...
  </div>
  <div class="${ClassName.BODY}">
    <div class="row">
      <div class="col border-right">
        <div class="form-group text-center">
          <span id="${Selector.INPUT_AMOUNT}"></span>
          <span id="${Selector.PAYMENT_METHOD}" class="pay-method-text">Crédito</span>
        </div>
      </div>
      <div class="col">
        <div class="spinner">
          <div class="spinner-bar"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="${ClassName.FOOTER} text-center">
    <span id="${Selector.PAY_METHODS}"></span>
  </div>
`

class CardProcessingForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
    this._router = null
  }

  _renderInputAmount() {
    const $inputAmount = this._$container.find(`#${Selector.INPUT_AMOUNT}`)
    this._inputAmountPartial = new InputAmountPartial($inputAmount, this._options)
    this._inputAmountPartial.disabled(true)
    this._inputAmountPartial.render()
    const $spanMethod = this._$container.find(`#${Selector.PAYMENT_METHOD}`)
    if (this._options.payment.credit === false) {
      $spanMethod.text("Débito")
    } else {
      $spanMethod.text("Crédito")
    }
  }

  _renderPayMethodIcons() {
    const $payMethods = this._$container.find(`#${Selector.PAY_METHODS}`)
    this._payMethodIconsPartial = new PayMethodIconsPartial($payMethods)
    this._payMethodIconsPartial.render()
    this._payMethodIconsPartial.activeIcon(this._options.payment.card.bin.cardBrand)
  }

  async _process() {
    const paymentsApi = new PaymentsApi(this._options)
    const payment = new Payment(this._options).toCreditCard()

    try {
      this._options.processedPayment = await paymentsApi.payWithCards(payment)

      if (this._options.processedPayment.status === "paid") {
        this._goTo(CardApprovedForm)
        if (!_isFunction(this._options.success)){
          console.error('Invalid options.success: Expected Function.')
        } else {
          this._options.success(this._options.processedPayment)
        }
      } else {
        this._goTo(CardReprovedForm)
        if (!_isFunction(this._options.fail)){
          console.error('Invalid options.fail: Expected Function.')
        } else {
          this._options.fail(this._options.processedPayment)
        }
      }
    } catch (e) {
      this._goTo(CardErrorForm)
      if (!_isFunction(this._options.fail)){
        console.error('Invalid options.fail: Expected Function.')
      } else {
        this._options.fail(this._options.processedPayment)
      }
    }
  }

  async render(router) {
    this._router = router
    this._$container.html(VIEW)
    this._renderInputAmount()
    this._renderPayMethodIcons()

    await this._process()
  }

  _goTo(form) {
    this._router.render(form, this._$container, this._options)
  }
}

export default CardProcessingForm
