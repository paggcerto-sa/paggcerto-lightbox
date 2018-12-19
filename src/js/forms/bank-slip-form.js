import $ from 'jquery'
import 'jquery-mask-plugin/dist/jquery.mask.min.js'
import '../jquery/mask-money'
import moment from 'moment'
import BankSlipInstallmentsForm from './bank-slip-installments-form'
import InputAmountPartial from '../partials/input-amount-partial'
import PayMethodIconsPartial from '../partials/pay-method-icons-partial'
import FormState from '../jquery/form-state'
import { NAMESPACE, ClassName, EventName, MaskMoney, PaymentLimit } from '../constants'
import { _isNullOrUndefined } from '../../js/util/annotations'

const Selector = {
  ADD_NOTE_TO_INSTRUCITONS: `${NAMESPACE}_addNoteToInstructions`,
  BTN_GO_BACK: `${NAMESPACE}_btnGoBack`,
  INPUT_AMOUNT: `${NAMESPACE}_inputAmount`,
  INPUT_DUE_DATE: `${NAMESPACE}_inputDueDate`,
  INPUT_DISCOUNT: `${NAMESPACE}_inputDiscount`,
  INPUT_NOTE: `${NAMESPACE}_inputNote`,
  PAY_METHODS: `${NAMESPACE}_payMethods`,
  SELECT_ACCEPTED_UNTIL: `${NAMESPACE}_selectAcceptedUntil`,
  SELECT_DISCOUNT_DAYS: `${NAMESPACE}_selectDiscountDays`,
  SELECT_FINES: `${NAMESPACE}_selectFines`,
  SELECT_INTEREST: `${NAMESPACE}_selectInterest`,
  TEXT_MAXIMUM_DISCOUNT: `${NAMESPACE}_discountMaximum`,
  TEXT_NOTE_COUNT: `${NAMESPACE}_noteCount`
}

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
            <div class="form-group">
              <label for="${Selector.INPUT_NOTE}">
                Descrição do pagamento:
                <small id="${Selector.TEXT_NOTE_COUNT}" class="text-secondary">0/255</small>
              </label>
              <textarea id="${Selector.INPUT_NOTE}" rows="2"class="form-control" style="resize: none;" maxlength="255"></textarea>
              <small class="text-secondary">Desconto, juros e multa serão impressos no(s) boleto(s).</small>
            </div>
            <div class="form-group">
              <label>Imprimir descrição nas instruções do boleto?</label><br>
              <label class="switch switch-to-success">
                <input id="${Selector.ADD_NOTE_TO_INSTRUCITONS}" type="checkbox">
                <span class="switch-slider"></span>
              </label>
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
    this._firstbind = true
  }

  render (router) {
    this._router = router

    this._$container.html(VIEW)

    this._assignInitialValues()
    this._bindButtons()
    this._bindForm()
    this._bindInputDiscount()
    this._bindInputDueDate()
    this._bindInputNote()
    this._bindMaximumDiscount()
    this._bindSelectAcceptedUntil()
    this._bindSelectFines()
    this._bindSelectInterest()
    this._renderInputAmount()
    this._renderPayMethodIcons()
    this._updateFormState({})
    this._checkAddNoteToInstructions()
    this._firstbind = false
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
      this._options.payment.note = null
      this._goBack()
    })
  }

  _bindForm () {
    const $form = this._$container.find('form')

    if (this._options.payment.bankSlip.avoidSteps) {
      this._goTo(BankSlipInstallmentsForm)
      return
    }

    $form.on(EventName.SUBMIT, () => {
      if (this._formState.invalid) return
      this._goTo(BankSlipInstallmentsForm)
    })
  }

  _bindInputNote () {
    const $inputNote = this._$container.find(`#${Selector.INPUT_NOTE}`)
    const $inputNoteCount = this._$container.find(`#${Selector.TEXT_NOTE_COUNT}`)

    $inputNote.on(EventName.KEY_UP, () => {
      this._options.payment.note = $inputNote.val()
      $inputNoteCount.text(`${this._options.payment.note.length}/255`)
    })
    .val(this._options.payment.note)

    if (this._options.payment.note != undefined || this._options.payment.note != null) {
      $inputNoteCount.text(`${this._options.payment.note.length}/255`)
    }

    if (!_isNullOrUndefined(this._options.payment.bankSlip.note) && this._firstbind) {
      $inputNote.val(this._options.payment.bankSlip.note)
      this._options.payment.note = this._options.payment.bankSlip.note
      $inputNoteCount.text(`${this._options.payment.note.length}/255`)
    }
  }

  _checkAddNoteToInstructions () {
    const $addNoteToInstructions = this._$container.find(`#${Selector.ADD_NOTE_TO_INSTRUCITONS}`)

    $addNoteToInstructions.on(EventName.CHANGE, () => {
      this._options.payment.bankSlip.addNoteToInstructions = $addNoteToInstructions.is(':checked')
    })

    if (this._options.payment.bankSlip.addNoteToInstructions) {
      $addNoteToInstructions.attr('checked', true);
    }
  }

  _bindInputDiscount () {
    const $inputDiscount = this._$container.find(`#${Selector.INPUT_DISCOUNT}`)

    $inputDiscount
      .maskMoney(Object.assign({ suffix: ' %' }, MaskMoney))
      .on('keyup.maskMoney', () => {
        let discount = $inputDiscount.maskMoney('unmasked').get(0)

        this._options.payment.bankSlip.discount = discount
        this._options.payment.bankSlip.discountText = $inputDiscount.val()
        if (this._firstbind) return
        this._formState.touch({ discount: true })
        this._updateFormState()
      })
      .val(this._options.payment.bankSlip.discountText)

    if (typeof this._options.payment.bankSlip.discountDays !== 'number') {
      $inputDiscount.attr('disabled', true)
    }

    if (!_isNullOrUndefined(this._options.payment.bankSlip.discount) && this._firstbind) {
      $inputDiscount.val(this._options.payment.bankSlip.discount + '%')
      this._updateFormState()
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
        if (!this._firstbind) this._formState.touch({ dueDate: true })
        this._bindSelectDiscountDays()
        this._updateFormState()
      })
      .mask("99/99/9999")
      .val(this._options.payment.bankSlip.dueDateText)
      .focus()

    if (!_isNullOrUndefined(this._options.payment.bankSlip) && !_isNullOrUndefined(this._options.payment.bankSlip.dueDate) && this._firstbind) {
      $inputDueDate.val(this._options.payment.bankSlip.dueDate)
      this._options.payment.bankSlip.dueDate = moment(this._options.payment.bankSlip.dueDate, "DD/MM/YYYY")
      $inputDueDate.trigger(EventName.KEY_UP)
    }
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
    const diffMaxDays = 30

    $selectDiscountDays.attr("disabled", true)

    if (this._isValidDueDate()) {
      $selectDiscountDays.removeAttr("disabled");
      const $inputDueDate = this._$container.find(`#${Selector.INPUT_DUE_DATE}`)
      const dueDateMoment = moment($inputDueDate.val(), "DD/MM/YYYY", true)
      var diffDays = (moment().diff(dueDateMoment, "days") * -1) + 1
      diffDays = diffDays >= 30 ? diffMaxDays : diffDays

      $selectDiscountDays.children("option:not(:first)").remove();

      for (let days = 0; days <= diffDays; days++) {
          const discountDaysText =
            days === 0 ? 'Até o vencimento' :
            days === 1 ? `Até ${days} dia antes` :
            `Até ${days} dias antes`;

          const $option = $('<option/>').attr('value', days).text(discountDaysText)
          $selectDiscountDays.append($option)

          if (this._options.payment.bankSlip.discountDays === days && this._firstbind) {
            $option.attr('selected', true)
          }

          if (this._options.payment.bankSlip.discountDays === days && !this._firstbind) {
            $option.attr('selected', true)
          }
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
      if (this._firstbind) return
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
    const dueDateString = moment(dueDate).format('YYYY-MM-DD')
    return !!dueDate && moment(dueDateString).isSameOrAfter(moment().format('YYYY-MM-DD'), ['year', 'month', 'day'])
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
        message: 'O vencimento é obrigatório e deve ser igual ou superior a data atual.'
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
