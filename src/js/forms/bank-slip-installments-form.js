import BankSlipForm from './bank-slip-form'
import BankSlipProcessingForm from './bank-slip-processing-form'
import FormState from 'src/js/jquery/form-state'
import InputAmountPartial from 'src/js/partials/input-amount-partial'
import InstallmentOptionsPartial from 'src/js/partials/installment-options-partial'
import PayMethodIconsPartial from 'src/js/partials/pay-method-icons-partial'
import { NAMESPACE, ClassName, EventName } from 'src/js/constants'

const Selector = {
  BTN_GO_BACK: `${NAMESPACE}_btnGoBack`,
  INPUT_AMOUNT: `${NAMESPACE}_inputAmount`,
  INSTALLMENT_OPTIONS: `${NAMESPACE}_installments`,
  PAY_METHODS: `${NAMESPACE}_payMethods`,
  TEXT_ACCEPTED_UNTIL: `${NAMESPACE}_acceptedUntil`,
  TEXT_CHARGES: `${NAMESPACE}_charges`,
  TEXT_DISCOUNT: `${NAMESPACE}_discount`,
}

const VIEW = `
  <form novalidate>
    <div class="${ClassName.HEADER}">
      Escolha a forma de parcelamento:
    </div>
    <div class="${ClassName.BODY}">
      <div class="row">
        <div class="col border-right">
          <div class="form-group text-center">
            <span id="${Selector.INPUT_AMOUNT}"></span>
            <span class="pay-method-text">Boleto</span>
          </div>
        </div>
        <div class="col">
          <div class="w-100">
            <div class="form-group">
              <span id="${Selector.INSTALLMENT_OPTIONS}"></span>
            </div>
            <div class="form-group text-secondary">
              <label> Instruções:</label>
              <div><small id="${Selector.TEXT_ACCEPTED_UNTIL}"></small></div>
              <div><small id="${Selector.TEXT_CHARGES}"></small></div>
              <div><small id="${Selector.TEXT_DISCOUNT}"></small></div>
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
      <button type="submit" class="btn-footer continue">
        <span class="icon-arrow right"></span><br>
        <span>Finalizar</span>
      </button>
    </div>
  </form>
`

class BankSlipInstallmentsForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
  }

  _assignInitialValues() {
    this._options.payment.installments = 1
  }

  _bindButtons() {
    const $btnGoBack = this._$container.find(`#${Selector.BTN_GO_BACK}`)

    $btnGoBack.on(EventName.CLICK, () => {
      this._options.payment.installments = 1
      const bankSlipForm = new BankSlipForm(this._$container, this._options)
      bankSlipForm.render()
    })
  }

  _bindForm() {
    this._$form = this._$container.find('form')

    this._$form.on(EventName.SUBMIT, async () => {
      if (this._formState.invalid) return
      const bankSlipProcessingForm = new BankSlipProcessingForm(this._$container, this._options)
      await bankSlipProcessingForm.render()
    })
  }

  _bindInstallments() {
    const $installmentOptions = this._$container.find(`#${Selector.INSTALLMENT_OPTIONS}`)
    this._installmentOptionsPartial = new InstallmentOptionsPartial($installmentOptions, this._options)
    this._installmentOptionsPartial.render()
  }

  _bindTextAcceptedUntil() {
    const $acceptedUntil = this._$container.find(`#${Selector.TEXT_ACCEPTED_UNTIL}`)
    const acceptedUntil = this._options.payment.bankSlip.acceptedUntil

    const instruction =
      !acceptedUntil ? 'Não aceitar após o vencimento.' :
      acceptedUntil === 0 ? 'Aceitar até o vencimento.' :
      acceptedUntil === 1 ? 'Aceitar até 1 dia após do vencimento.' :
      `Aceitar até ${acceptedUntil} dias após do vencimento.`;

    $acceptedUntil.text(instruction)
  }

  _bindTextCharges() {
    const $charges = this._$container.find(`#${Selector.TEXT_CHARGES}`)
    const acceptedUntil = this._options.payment.bankSlip.acceptedUntil
    const fines = this._options.payment.bankSlip.fines
    const interest = this._options.payment.bankSlip.interest

    if (!acceptedUntil) return

    const finesText = fines ? fines.toString().replace('.', ',') : null
    const interestText = interest ? interest.toString().replace('.', ',') : null

    const instruction =
      !(finesText || interest) ? 'Título sem multa e juros.' :
      finesText && interestText ? `Multa de ${finesText}% e juros de ${interestText}% (a.m.).` :
      finesText ? `Multa de ${finesText}%.` : `Juros de ${interestText}% (a.m.).`

    $charges.text(instruction)
  }

  _bindTextDiscount() {
    const $discount = this._$container.find(`#${Selector.TEXT_DISCOUNT}`)
    const discountDays = this._options.payment.bankSlip.discountDays
    const discount = this._options.payment.bankSlip.discount

    const discountText = discount ? discount.toString().replace('.', ',') : null
    const discountDaysText =
      discountDays === 0 ? 'até o vencimento.' :
      discountDays === 1 ? 'até 1 dia antes do vencimento.' :
      `até ${discountDays} dias antes do vencimento.`;

    const instruction = discountText ? `Desconto de ${discountText}% ${discountDaysText}.` : 'Título sem desconto.'

    $discount.text(instruction)
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
    this._payMethodIconsPartial.activeIcon('bank-slip')
  }

  _updateFormState() {
    this._formState = new FormState(this._$form)
  }

  render() {
    this._$container.html(VIEW)

    this._assignInitialValues()
    this._bindButtons()
    this._bindForm()
    this._bindInstallments()
    this._bindTextAcceptedUntil()
    this._bindTextCharges()
    this._bindTextDiscount()
    this._renderInputAmount()
    this._renderPayMethodIcons()
    this._updateFormState()
  }
}

export default BankSlipInstallmentsForm
