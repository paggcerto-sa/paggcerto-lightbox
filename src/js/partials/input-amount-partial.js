import $ from 'node_modules/jquery'
import 'src/js/jquery/mask-money'
import { Delay } from 'src/js/constants'

const VIEW = `
  <div class="input-amount">
    <input type="text" maxlength="12">
  </div>
`;

class InputAmountPartial {
  constructor($container, store) {
    this._$container = $container
    this._store = store
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
      .maskMoney({
        affixesStay: true,
        prefix: 'R$ ',
        allowZero: true,
        allowNegative: false,
        thousands: '.',
        decimal: ','
      })
      .on('keyup.maskMoney', () => {
        this._store.amount = this._$input.maskMoney('unmasked').get(0)
        this._store.amountText = this._$input.val()
        this._callbackChange()
      })
      .val(this._store.amountText || 'R$ 0,00')
      .trigger('keyup.maskMoney')
  }

  _callbackChange() {
    if (typeof this._events.onChange === 'function') {
      this._events.onChange()
    }
  }

  disabled(disabled) {
    this._attributes.disabled = disabled
    return this
  }

  onChange(event) {
    this._events.onChange = event
    return this
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
