import $ from 'node_modules/jquery'
import 'src/js/jquery/mask-money'
import { Delay, MaskMoney } from 'src/js/constants'

const VIEW = `
  <div class="form-circle form-circle-primary">
    <input type="text" maxlength="12">
  </div>
`

class InputAmountPartial {
  constructor($container, options) {
    this._$container = $container
    this._options = options
    this._attributes = {}
    this._events = {}
  }

  _bindInputAttributes() {
    if (this._attributes.disabled) {
      this._$input.attr('disabled', true)
    }
  }

  _bindInputEvents() {
    this._$input
      .maskMoney(Object.assign({ prefix: 'R$ ' }, MaskMoney))
      .on('keyup.maskMoney', () => {
        this._options.payment.amount = this._$input.maskMoney('unmasked').get(0)
        this._options.payment.amountText = this._$input.val()
        this._callbackChange()
      })
      .val(this._options.payment.amountText)
      .trigger('keyup.maskMoney')
  }

  _callbackChange() {
    if (typeof this._events.onChange === 'function') {
      this._events.onChange()
    }
  }

  disabled(disabled) {
    this._attributes.disabled = disabled
  }

  onChange(event) {
    this._events.onChange = event
  }

  render() {
    this._$inputAmount = $(VIEW)
    this._$input = this._$inputAmount.find('input')
    this._$container.replaceWith(this._$inputAmount)

    this._bindInputAttributes()
    this._bindInputEvents()

    // Focus is not triggered before modal's transition is complete
    setTimeout(() => this._$input.focus(), Delay.INPUT_AMOUNT_FOCUS)
  }
}

export default InputAmountPartial
