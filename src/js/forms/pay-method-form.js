import CardOnlineForm from './card-online-form'
import BankSlipForm from './bank-slip-form'
import InputAmountPartial from 'src/js/partials/input-amount-partial'
import PayMethodIconsPartial from 'src/js/partials/pay-method-icons-partial'
import { NAMESPACE, ClassName, EventName, PaymentLimit } from 'src/js/constants'

const Selector = {
  BTN_BANK_SLIP: `${NAMESPACE}_btnBankSlip`,
  BTN_CREDIT: `${NAMESPACE}_btnCredit`,
  BTN_DEBIT: `${NAMESPACE}_btnDebit`,
  BTN_CANCEL: `${NAMESPACE}_btnCancel`,
  INPUT_AMOUNT: `${NAMESPACE}_inputAmount`,
  PAY_METHODS: `${NAMESPACE}_payMethods`
}

const VIEW = `
  <div class="${ClassName.HEADER}">
    Digite o valor e selecione a forma de pagamento:
  </div>
  <div class="${ClassName.BODY}">
    <div class="row">
      <div class="col border-right">
        <div class="form-group">
          <span id="${Selector.INPUT_AMOUNT}"></span>
        </div>
      </div>
      <div class="col">
        <button id="${Selector.BTN_CREDIT}" type="button" class="btn-card">
          <span class="icon-btn credit"></span>
          Crédito
        </button>
        <button id="${Selector.BTN_DEBIT}" type="button" class="btn-card">
          <span class="icon-btn debit"></span>
          Débito
        </button>
        <button id="${Selector.BTN_BANK_SLIP}" type="button" class="btn-card">
          <span class="icon-btn bank-slip"></span>
          Boleto
        </button>
      </div>
    </div>
  </div>
  <div class="${ClassName.FOOTER} text-center">
    <span id="${Selector.PAY_METHODS}"></span>
  </div>
`

class PayMethodForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
  }

  _toggleBankSlipButton() {
    if (!this._options.payment.bankSlipEnabled) {
      this._$bankSlipButton.remove()
    } else if (this._options.payment.amount >= PaymentLimit.BANK_SLIP_AMOUNT_MINIMUM) {
      this._$bankSlipButton.removeAttr('disabled')
    } else {
      this._$bankSlipButton.attr('disabled', true)
    }
  }

  _toggleCreditButton() {
    if (!this._options.payment.creditEnabled) {
      this._$creditButton.remove()
    } else if (this._options.payment.amount >= PaymentLimit.CREDIT_AMOUNT_MINIMUM_SINGLE_INSTALLMENT) {
      this._$creditButton.removeAttr('disabled')
    } else {
      this._$creditButton.attr('disabled', true)
    }
  }

  _toggleDebitButton() {
    if (!this._options.payment.debitEnabled) {
      this._$debitButton.remove()
    } else if (this._options.payment.amount >= PaymentLimit.DEBIT_AMOUNT_MINIMUM) {
      this._$debitButton.removeAttr('disabled')
    } else {
      this._$debitButton.attr('disabled', true)
    }
  }

  _toggleMethodButtons() {
    this._toggleBankSlipButton()
    this._toggleCreditButton()
    this._toggleDebitButton()
  }

  _payWithBankSlip() {
    const bankSlipForm = new BankSlipForm(this._$container, this._options)
    bankSlipForm.render()
  }

  _payWithCreditCard() {
    const cardOnlineForm = new CardOnlineForm(this._$container, this._options)
    cardOnlineForm.render()
  }

  _payWithDebitCard() {
    // TODO
  }

  _renderInputAmount() {
    const $inputAmount = this._$container.find(`#${Selector.INPUT_AMOUNT}`)
    const inputAmountPartial = new InputAmountPartial($inputAmount, this._options)
    inputAmountPartial.disabled(!this._options.payment.amountEditable)
    inputAmountPartial.onChange(() => this._toggleMethodButtons())
    inputAmountPartial.render()
  }

  _renderPayMethodIcons() {
    const $payMethods = this._$container.find(`#${Selector.PAY_METHODS}`)
    const payMethodIconsPartial = new PayMethodIconsPartial($payMethods)
    payMethodIconsPartial.render()
  }

  render() {
    this._$container.html(VIEW)

    this._$bankSlipButton = this._$container.find(`#${Selector.BTN_BANK_SLIP}`)
    this._$creditButton = this._$container.find(`#${Selector.BTN_CREDIT}`)
    this._$debitButton = this._$container.find(`#${Selector.BTN_DEBIT}`)

    if (this._options.payment.onlyBankSlipEnabled) this._payWithBankSlip()
    if (this._options.payment.onlyCreditEnabled) this._payWithCreditCard()
    if (this._options.payment.onlyDebitEnabled) this._payWithDebitCard()

    this._$bankSlipButton.on(EventName.CLICK, () => this._payWithBankSlip())
    this._$creditButton.on(EventName.CLICK, () => this._payWithCreditCard())
    this._$debitButton.on(EventName.CLICK, () => this._payWithDebitCard())

    this._renderInputAmount()
    this._renderPayMethodIcons()
  }
}

export default PayMethodForm
