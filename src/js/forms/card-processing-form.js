import CardErrorForm from '../forms/card-error-form'
import CardReprovedForm from '../forms/card-reproved-form'
import CardApprovedForm from '../forms/card-approved-form'
import InputAmountPartial from '../partials/input-amount-partial'
import PayMethodIconsPartial from '../partials/pay-method-icons-partial'
import PaymentsApi from '../sdk/payments-api'
import Payment from '../sdk/payment'
import { NAMESPACE, ClassName } from '../constants'

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

  _renderInputAmount() {
    const $inputAmount = this._$container.find(`#${Selector.INPUT_AMOUNT}`)
    this._inputAmountPartial = new InputAmountPartial($inputAmount, this._options)
    this._inputAmountPartial.disabled(true)
    this._inputAmountPartial.render()
  }

  _renderPayMethodIcons() {
    const $payMethods = this._$container.find(`#${Selector.PAY_METHODS}`)
    this._payMethodIconsPartial = new PayMethodIconsPartial($payMethods)
    this._payMethodIconsPartial.render()
    this._payMethodIconsPartial.activeIcon(this._options.payment.card.bin.cardBrand)
  }

  async _process() {

    if (this._options.pinpad !== null) {
      return
    }

    const paymentsApi = new PaymentsApi(this._options)
    const payment = new Payment(this._options).toCreditCard()

    try {
      this._options.processedPayment = await paymentsApi.payWithCards(payment)

      if (this._options.processedPayment.status === 'paid') {
        const cardApprovedForm = new CardApprovedForm(this._$container, this._options)
        cardApprovedForm.render()
      } else {
        const cardReprovedForm = new CardReprovedForm(this._$container, this._options)
        cardReprovedForm.render()
      }
    } catch (e) {
      const cardErrorForm = new CardErrorForm(this._$container, this._options)
      cardErrorForm.render()
    }
  }

  async render() {
    this._$container.html(VIEW)

    this._renderInputAmount()
    this._renderPayMethodIcons()

    await this._process()
  }
}

export default CardProcessingForm
