import { NAMESPACE, ClassName } from 'src/js/constants'
import CardReprovedForm from 'src/js/forms/card-reproved-form'
import CardApprovedForm from 'src/js/forms/card-approved-form'
import InputAmountPartial from 'src/js/partials/input-amount-partial'
import PaymentIconsPartial from 'src/js/partials/payment-icons-partial'
import PaymentsApi from 'src/js/sdk/payments-api'
import Payment from 'src/js/sdk/payment'

const Selector = {
  INPUT_AMOUNT: `${NAMESPACE}_inputAmount`,
  PAY_METHODS: `${NAMESPACE}_payMethods`
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
          <span class="pay-method-text">Crédito</span>
        </div>
      </div>
      <div class="col">
        <div class="spinner">
          <div class="spinner-bar"></div>
          <div class="icon-logo-sm"></div>
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
  }

  _renderFooter() {
    const $inputAmount = this._$container.find(`#${Selector.INPUT_AMOUNT}`)
    this._inputAmountPartial = new InputAmountPartial($inputAmount, this._options)
    this._inputAmountPartial.disabled(true)
    this._inputAmountPartial.render()

    const $payMethods = this._$container.find(`#${Selector.PAY_METHODS}`)
    this._paymentIconsPartial = new PaymentIconsPartial($payMethods)
    this._paymentIconsPartial.render()
    this._paymentIconsPartial.activeIcon(this._options.payment.card.bin.cardBrand)
  }

  async _process() {
    const paymentsApi = new PaymentsApi(this._options.token)
    const payment = new Payment(this._options).toCreditCard()

    this._options.processedPayment = await paymentsApi.payWithCards(payment)

    if (this._options.processedPayment.status === 'paid') {
      const cardApprovedForm = new CardApprovedForm(this._$container, this._options)
      cardApprovedForm.render()
    } else {
      const cardReprovedForm = new CardReprovedForm(this._$container, this._options)
      cardReprovedForm.render()
    }
  }

  async render() {
    this._$container.html(VIEW)
    this._renderFooter()

    await this._process()
  }
}

export default CardProcessingForm
