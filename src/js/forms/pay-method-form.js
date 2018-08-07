import 'src/js/jquery/mask-money'
import { ClassName, Event, Payment } from 'src/js/constants'

const Selector = {
  BTN_BANK_SLIP: 'pagg_btnBankSlip',
  BTN_CREDIT: 'pagg_btnCredit',
  BTN_DEBIT: 'pagg_btnDebit',
  BTN_CANCEL: 'pagg_btnCancel',
  INPUT_AMOUNT: 'pagg_inputAmount'
}

const VIEW = `
  <div class="${ClassName.HEADER}">
    Digite o valor e selecione a forma de pagamento:
  </div>
  <div class="${ClassName.BODY}">
    <div class="row">
      <div class="col border-right">
        <div class="form-group">
          <div class="input-amount">
            <input id="${Selector.INPUT_AMOUNT}" type="text" maxlength="12">
          </div>
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
    <span class="icon-payment visa"></span>
    <span class="icon-payment mastercard"></span>
    <span class="icon-payment elo"></span>
    <span class="icon-payment dinersclub"></span>
    <span class="icon-payment hipercard"></span>
    <span class="icon-payment amex"></span>
    <span class="icon-payment banese"></span>
    <span class="icon-payment bank-slip"></span>
  </div>
`;

class PayMethodForm {
  constructor($lightboxContent, options, store) {
    this._$lightboxContent = $lightboxContent
    this._options = options
    this._store = store
  }

  _checkBankSlipButton($bankSlipButton) {
    if (!this._options.payment.bankSlip) {
      $bankSlipButton.remove()
    } else if (this._store.amount >= Payment.MINIMUM_BANK_SLIP_AMOUNT) {
      $bankSlipButton.removeAttr('disabled')
    } else {
      $bankSlipButton.attr('disabled', true)
    }
  }

  _checkCreditButton($creditButton) {
    if (!this._options.payment.credit) {
      $creditButton.remove()
    } else if (this._store.amount >= Payment.MINIMUM_CREDIT_AMOUNT) {
      $creditButton.removeAttr('disabled')
    } else {
      $creditButton.attr('disabled', true)
    }
  }

  _checkDebitButton($debitButton) {
    if (!this._options.payment.debit) {
      $debitButton.remove()
    } else if (this._store.amount >= Payment.MINIMUM_DEBIT_AMOUNT) {
      $debitButton.removeAttr('disabled')
    } else {
      $debitButton.attr('disabled', true)
    }
  }

  _payWithBankSlip() {
    // TODO
  }

  _payWithCreditCard() {
    // TODO
  }

  _payWithDebitCard() {
    // TODO
  }

  render() {
    this._$lightboxContent.html(VIEW)

    const $inputAmount = this._$lightboxContent.find(`#${Selector.INPUT_AMOUNT}`)
    const $bankSlipButton = this._$lightboxContent.find(`#${Selector.BTN_BANK_SLIP}`)
    const $creditButton = this._$lightboxContent.find(`#${Selector.BTN_CREDIT}`)
    const $debitButton = this._$lightboxContent.find(`#${Selector.BTN_DEBIT}`)

    $inputAmount
      .maskMoney({
        affixesStay: true,
        prefix:'R$ ',
        allowZero: true,
        allowNegative: false,
        thousands:'.',
        decimal:','
      })
      .on('keyup.maskMoney', () => {
        this._store.amount = $inputAmount.maskMoney('unmasked').get(0)
        this._store.amountText = $inputAmount.val()
        this._checkBankSlipButton($bankSlipButton)
        this._checkCreditButton($creditButton)
        this._checkDebitButton($debitButton)
      })
      .val(this._store.amountText || 'R$ 0,00')
      .trigger('keyup.maskMoney')

      if (this._options.payment.onlyBankSlip) this._payWithBankSlip()
      $bankSlipButton.on(Event.CLICK, () => this._payWithBankSlip())

      if (this._options.payment.onlyCredit) this._payWithCreditCard()
      $creditButton.on(Event.CLICK, () => this._payWithCreditCard())

      if (this._options.payment.onlyDebit) this._payWithDebitCard()
      $debitButton.on(Event.CLICK, () => this._payWithDebitCard())

      // Focus is not triggered before modal's transition is complete
      setTimeout(() => $inputAmount.focus(), 75)
  }
}

export default PayMethodForm
