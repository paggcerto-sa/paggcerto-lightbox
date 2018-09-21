import $ from 'jquery'
import 'jquery-mask-plugin/dist/jquery.mask.min.js'
import '../jquery/mask-money'
import moment from 'moment'
import BankSlipInstallmentsForm from './bank-slip-installments-form'
import InputAmountPartial from '../partials/input-amount-partial'
import PayMethodIconsPartial from '../partials/pay-method-icons-partial'
import PayMethodForm from './pay-method-form'
import FormState from '../jquery/form-state'
import { NAMESPACE, ClassName, EventName, MaskMoney, PaymentLimit } from '../constants'

const Selector = {
  BTN_GO_BACK: `${NAMESPACE}_btnGoBack`,
  INPUT_AMOUNT: `${NAMESPACE}_inputAmount`,
  INPUT_DUE_DATE: `${NAMESPACE}_inputDueDate`,
  INPUT_DISCOUNT: `${NAMESPACE}_inputDiscount`,
  PAY_METHODS: `${NAMESPACE}_payMethods`,
  SELECT_ACCEPTED_UNTIL: `${NAMESPACE}_selectAcceptedUntil`,
  SELECT_DISCOUNT_DAYS: `${NAMESPACE}_selectDiscountDays`,
  SELECT_FINES: `${NAMESPACE}_selectFines`,
  SELECT_INTEREST: `${NAMESPACE}_selectInterest`,
  TEXT_MAXIMUM_DISCOUNT: `${NAMESPACE}_discountMaximum`,
  INPUT_INSTRUCTIONS: `${NAMESPACE}_instructions`,
  TEXT_INSTRUCTIONS_COUNT: `${NAMESPACE}_instructionsCount`,
  INPUT_CHECK_PRINT_INSTRUCTIONS: `${NAMESPACE}_inputCheckPrintInstructions`
}

const INSTRUCTIONS_PLACEHOLDER = 'Instruções de desconto, juros e multa serão inclusos automaticamente.'

const VIEW = `
  <form novalidate autocomplete="off">
    <div class="${ClassName.HEADER}">
      Informe as condições de pagamento:
      <div class="alert alert-danger d-none"></div>
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
          <div>
            <div class="row">
              <div class="col">
                <div class="form-group">
                  <label>Vencimento:</label>
                  <input id="${Selector.INPUT_DUE_DATE}" type="text" class="form-control" placeholder="00/00/0000" maxlength="10" autocomplete="off">
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <label>Aceitar após vencimento?</label>
                  <select id="${Selector.SELECT_ACCEPTED_UNTIL}" class="form-control"></select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="form-group">
                  <label>Multa:</label>
                  <select id="${Selector.SELECT_FINES}" class="form-control">
                    <option value="">Não haverá multa</option>
                  </select>
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <label>Juros:</label>
                  <select id="${Selector.SELECT_INTEREST}" class="form-control">
                    <option value="">Não haverá juros</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="form-group">
                  <label>Oferecer desconto?</label>
                  <select id="${Selector.SELECT_DISCOUNT_DAYS}" class="form-control">
                    <option value="">Sem desconto</option>
                  </select>
                </div>
              </div>
              <div class="col">
                <div class="form-group">
                  <label>Valor do desconto:</label>
                  <input id="${Selector.INPUT_DISCOUNT}" type="text" class="form-control" maxlength="7" autocomplete="off">
                  <small id="${Selector.TEXT_MAXIMUM_DISCOUNT}" class="text-secondary"></small>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="form-group">
                  <label for="${Selector.INPUT_INSTRUCTIONS}">Descrição do pagamento</label>
                  <textarea id="${Selector.INPUT_INSTRUCTIONS}" rows="3"class="form-control" style="resize: none;" maxlength="255" placeholder="${INSTRUCTIONS_PLACEHOLDER}"></textarea>
                  <small id="${Selector.TEXT_INSTRUCTIONS_COUNT}" class="text-secondary">0/255</small>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="form-group">
                <label class="switch switch-to-success">
                  <input id="${Selector.CHECK_PRINT_INSTRUCTIONS}" type="checkbox">
                  <span class="switch-slider"></span>&nbsp;Instrução de pagamento
                  </label>
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
      <button type="submit" class="btn-footer continue">
        <span class="icon-arrow right"></span><br>
        <span>Continuar</span>
      </button>
    </div>
  </form>
`

class BankSlipForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
    this._router = null
  }

  render (router) {

    this._router = router

    this._$container.html(VIEW)

    this._assignInitialValues()
    this._bindButtons()
    this._bindForm()
    this._bindInputDiscount()
    this._bindInputDueDate()
    this._bindMaximumDiscount()
    this._bindSelectAcceptedUntil()
    this._bindSelectFines()
    this._bindSelectInterest()
    this._bindSelectDiscountDays()
    this._renderInputAmount()
    this._renderPayMethodIcons()
    this._updateFormState({})
    this._bindInstructionsCount()
    this._checkPrintInstructions()
  }

  _assignInitialValues () {
    this._options.payment.bankSlip = this._options.payment.bankSlip || {
      acceptedUntil: 0,
      discountText: '0,00 %',
      addNoteToInstructions: false
    }

    this._calculateMaximumDiscount()
  }

  _bindButtons () {
    const $btnGoBack = this._$container.find(`#${Selector.BTN_GO_BACK}`)

    if (this._options.payment.onlyBankSlipEnabled) {
      $btnGoBack.attr('disabled', true)
      return
    }

    $btnGoBack.on(EventName.CLICK, () => {
      this._options.payment.bankSlip = null
      this._goBack()
    })
  }

  _bindForm () {
    const $form = this._$container.find('form')

    $form.on(EventName.SUBMIT, () => {
      if (this._formState.invalid) return
      this._goTo(BankSlipInstallmentsForm)
    })
  }

  _checkPrintInstructions () {
    const $inputCheckPrintInstructions = this._$container.find(`#${Selector.CHECK_PRINT_INSTRUCTIONS}`)

    $inputCheckPrintInstructions.on('click', () => {
      this._options.payment.bankSlip.addNoteToInstructions = $inputCheckPrintInstructions.is(':checked')
    })
  }

  _bindInputDiscount () {
    const $inputDiscount = this._$container.find(`#${Selector.INPUT_DISCOUNT}`)

    $inputDiscount
      .maskMoney(Object.assign({ suffix: ' %' }, MaskMoney))
      .on('keyup.maskMoney', () => {
        let discount = $inputDiscount.maskMoney('unmasked').get(0)

        this._options.payment.bankSlip.discount = discount
        this._options.payment.bankSlip.discountText = $inputDiscount.val()
        this._formState.touch({ discount: true })
        this._updateFormState()
      })
      .val(this._options.payment.bankSlip.discountText)

    if (typeof this._options.payment.bankSlip.discountDays !== 'number') {
      $inputDiscount.attr('disabled', true)
    }
  }

  _bindInputDueDate () {
    const $inputDueDate = this._$container.find(`#${Selector.INPUT_DUE_DATE}`)

    $inputDueDate
      .on(EventName.KEY_UP, () => {
        const dueDateText = $inputDueDate.val()
        const dueDateMoment = moment(dueDateText, 'DD/MM/YYYY', true)
        this._options.payment.bankSlip.dueDate = dueDateMoment.isValid() ? dueDateMoment.toDate() : null
        this._options.payment.bankSlip.dueDateText = dueDateText
        this._formState.touch({ dueDate: true })
        this._updateFormState()
      })
      .mask("99/99/9999")
      .val(this._options.payment.bankSlip.dueDateText)
      .focus()
  }

  _bindMaximumDiscount () {
    const $discountMaximum = this._$container.find(`#${Selector.TEXT_MAXIMUM_DISCOUNT}`)
    const discountMaximumText = this._options.payment.bankSlip.discountMaximumText

    $discountMaximum.text(`Máximo ${discountMaximumText || '0,00'} %`)
  }

  _bindSelectAcceptedUntil () {
    const $selectAcceptedUntil = this._$container.find(`#${Selector.SELECT_ACCEPTED_UNTIL}`)
    const $selectFines = this._$container.find(`#${Selector.SELECT_FINES}`)
    const $selectInterest = this._$container.find(`#${Selector.SELECT_INTEREST}`)

    for (let days = 0; days <= 25; days++) {
      const acceptedUntilText =
        days === 0 ? 'Não aceitar' :
          days === 1 ? `Até ${days} dia` :
            `Até ${days} dias`;

      const $option = $('<option/>').attr('value', days).text(acceptedUntilText)
      $selectAcceptedUntil.append($option)

      if (this._options.payment.bankSlip.acceptedUntil === days) {
        $option.attr('selected', true)
      }
    }

    $selectAcceptedUntil.on(EventName.CHANGE, () => {
      const value = $selectAcceptedUntil.val()
      const acceptedUntil = Number(value)

      this._options.payment.bankSlip.acceptedUntil = acceptedUntil

      if (acceptedUntil === 0) {
        $selectFines.attr('disabled', true).val('').change()
        $selectInterest.attr('disabled', true).val('').change()
      } else {
        $selectFines.removeAttr('disabled')
        $selectInterest.removeAttr('disabled')
      }
    })
  }

  _bindSelectDiscountDays () {
    const $selectDiscountDays = this._$container.find(`#${Selector.SELECT_DISCOUNT_DAYS}`)
    const $inputDiscount = this._$container.find(`#${Selector.INPUT_DISCOUNT}`)

    for (let days = 0; days <= 30; days++) {
      const discountDaysText =
        days === 0 ? 'Até o vencimento' :
          days === 1 ? `Até ${days} dia antes` :
            `Até ${days} dias antes`;

      const $option = $('<option/>').attr('value', days).text(discountDaysText)
      $selectDiscountDays.append($option)

      if (this._options.payment.bankSlip.discountDays === days) {
        $option.attr('selected', true)
      }
    }

    $selectDiscountDays.on(EventName.CHANGE, () => {
      const value = $selectDiscountDays.val()

      if (value === '') {
        $inputDiscount.attr('disabled', true).val('0,00 %')
        this._options.payment.bankSlip.discount = null
        this._options.payment.bankSlip.discountDays = null
        this._options.payment.bankSlip.discountText = null
      } else {
        $inputDiscount.removeAttr('disabled')
        this._options.payment.bankSlip.discountDays = Number(value)
      }

      this._formState.touch({ discount: true })
      this._updateFormState()
    })
  }

  _bindSelectFines () {
    const $selectFines = this._$container.find(`#${Selector.SELECT_FINES}`)
    const finesOptions = [.25, .5, .75].concat(Array.from(Array(20), (val, index) => index + 1))

    finesOptions.forEach((charge) => {
      const note = charge === 2 ? ' (máx por lei)' : ''
      const finesOptionText = `${charge.toString().replace('.', ',')}% ${note}`
      const $finesOption = $('<option/>').attr('value', charge).text(finesOptionText)

      $selectFines.append($finesOption)

      if (this._options.payment.bankSlip.fines === charge) {
        $finesOption.attr('selected', true)
      }
    })

    if (!this._options.payment.bankSlip.acceptedUntil) {
      $selectFines.attr('disabled', true)
    }

    $selectFines.on(EventName.CHANGE, () => {
      const value = $selectFines.val()
      this._options.payment.bankSlip.fines = value === '' ? null : Number(value)
    })
  }

  _bindSelectInterest () {
    const $selectInterest = this._$container.find(`#${Selector.SELECT_INTEREST}`)
    const interestOptions = [.25, .5, .75].concat(Array.from(Array(20), (val, index) => index + 1))

    interestOptions.forEach((charge) => {
      const note = charge === 1 ? ' (máx por lei)' : ''
      const interestOptionText = `${charge.toString().replace('.', ',')}% ${note}`
      const $interestOption = $('<option/>').attr('value', charge).text(interestOptionText)

      $selectInterest.append($interestOption)

      if (this._options.payment.bankSlip.interest === charge) {
        $interestOption.attr('selected', true)
      }
    })

    if (!this._options.payment.bankSlip.acceptedUntil) {
      $selectInterest.attr('disabled', true)
    }

    $selectInterest.on(EventName.CHANGE, () => {
      const value = $selectInterest.val()
      this._options.payment.bankSlip.interest = value === '' ? null : Number(value)
    })
  }

  _bindInstructionsCount () {
    const instructionsCount = this._$container.find(`#${Selector.TEXT_INSTRUCTIONS_COUNT}`)
    const instructionsInput = this._$container.find(`#${Selector.INPUT_INSTRUCTIONS}`)
    let oldValue = ''

    instructionsInput.on('change paster keyup', () => {
      if (oldValue === instructionsInput.val()) return

      oldValue = instructionsInput.val()
      const value = oldValue || ''

      instructionsCount.text(`${value.length}/255`)
      this._options.payment.instructions = value
    });
  }

  _calculateMaximumDiscount () {
    const amount = this._options.payment.amount
    if (!amount) return

    const minimumAmount = PaymentLimit.BANK_SLIP_AMOUNT_MINIMUM
    const discountMaximum = Math.floor((100 - minimumAmount * 100 / amount) * 100) / 100
    const discountMaximumText = discountMaximum > 0 ? discountMaximum.toString().replace('.', ',') : null

    this._options.payment.bankSlip.discountMaximum = discountMaximum
    this._options.payment.bankSlip.discountMaximumText = discountMaximumText
  }

  _isValidDiscount () {
    const discountDaysNull = typeof this._options.payment.bankSlip.discountDays !== 'number'
    if (discountDaysNull) return true

    const discount = this._options.payment.bankSlip.discount
    const discountMaximum = this._options.payment.bankSlip.discountMaximum

    return discount > 0 && discount <= discountMaximum
  }

  _isValidDueDate () {
    const dueDate = this._options.payment.bankSlip.dueDate
    return !!dueDate && moment(dueDate).isAfter(new Date())
  }

  _renderInputAmount () {
    const $inputAmount = this._$container.find(`#${Selector.INPUT_AMOUNT}`)
    const disabled = !(this._options.payment.amountEditable && this._options.payment.onlyBankSlipEnabled)

    this._inputAmountPartial = new InputAmountPartial($inputAmount, this._options)
    this._inputAmountPartial.disabled(disabled)
    this._inputAmountPartial.onChange(() => {
      this._calculateMaximumDiscount()
      this._bindMaximumDiscount()
      this._formState.touch({ amount: true })
      this._updateFormState()
    })

    this._inputAmountPartial.render()
  }

  _renderPayMethodIcons () {
    const $payMethods = this._$container.find(`#${Selector.PAY_METHODS}`)

    this._payMethodIconsPartial = new PayMethodIconsPartial($payMethods)
    this._payMethodIconsPartial.render()
    this._payMethodIconsPartial.activeIcon('bank-slip')
  }

  _updateFormState () {
    this._formState = this._formState || new FormState(this._$container)
    this._formState.update(Object.assign({
      amount: {
        valid: this._options.payment.amount >= PaymentLimit.BANK_SLIP_AMOUNT_MINIMUM,
        message: `O valor do pagamento deve ser maior ou igual a R$ ${PaymentLimit.BANK_SLIP_AMOUNT_MINIMUM}.`
      },
      discount:
      {
        valid: this._isValidDiscount(),
        message: 'O desconto deve ser maior do que zero e menor do que o máximo permitido.'
      },
      dueDate: {
        valid: this._isValidDueDate(),
        message: 'O vencimento é obrigatório e deve ser posterior a data atual (D+1).'
      }
    }))
  }

  _goTo (form) {
    this._router.render(form, this._$container, this._options)
  }

  _goBack () {
    this._router.goBack()
  }
}

export default BankSlipForm
