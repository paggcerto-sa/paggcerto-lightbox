import 'node_modules/jquery-mask-plugin/dist/jquery.mask.min.js'
import InputAmountPartial from 'src/js/partials/input-amount-partial'
import PayMethodIconsPartial from 'src/js/partials/pay-method-icons-partial'
import CardInstallmentsForm from './card-installments-form'
import PayMethodForm from './pay-method-form'
import FormState from 'src/js/jquery/form-state'
import Textual from 'src/js/util/textual'
import { NAMESPACE, ClassName, EventName } from 'src/js/constants'

const Selector = {
  BTN_GO_BACK: `${NAMESPACE}_btnGoBack`,
  INPUT_AMOUNT: `${NAMESPACE}_inputAmount`,
  INPUT_CARD_NUMBER: `${NAMESPACE}_inputCardNumber`,
  INPUT_HOLDER_NAME: `${NAMESPACE}_inputHolderName`,
  INPUT_CVV: `${NAMESPACE}_inputCvv`,
  PAY_METHODS: `${NAMESPACE}_payMethods`,
  SELECT_MONTH: `${NAMESPACE}_selectMonth`,
  SELECT_YEAR: `${NAMESPACE}_selectYear`
}

const VIEW = `
  <form novalidate>
    <div class="${ClassName.HEADER}">
      Insira os dados do cartão:
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
          <div>
            <div class="form-group">
              <label>Número do cartão:</label>
              <input id="${Selector.INPUT_CARD_NUMBER}" type="text" class="form-control" placeholder="0000 0000 0000 0000" maxlength="16">
            </div>
            <div class="form-group">
              <label>Nome do titular do cartão:</label>
              <input id="${Selector.INPUT_HOLDER_NAME}" type="text" class="form-control" placeholder="Como impresso no cartão" maxlength="50">
            </div>
            <div class="row">
              <div class="col-8">
                <div class="form-group">
                  <label>Validade:</label>
                  <div>
                    <select id="${Selector.SELECT_MONTH}" class="form-control d-inline w-45">
                      <option class="d-hide">MM</option>
                    </select>
                    <select id="${Selector.SELECT_YEAR}" class="form-control d-inline w-45">
                      <option class="d-hide">AAAA</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <div class="form-group">
                  <label>CVV:</label>
                  <input id="${Selector.INPUT_CVV}"  type="password" class="form-control" placeholder="000" maxlength="3">
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

class CardOnlineForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
  }

  _assignInitialValues() {
    this._options.payment.card = this._options.payment.card || {}
  }

  _bindButtons() {
    const $btnGoBack = this._$container.find(`#${Selector.BTN_GO_BACK}`)

    if (this._options.payment.onlyCreditEnabled) {
      $btnGoBack.attr('disabled', true)
      return
    }

    $btnGoBack.on(EventName.CLICK, () => {
      this._options.payment.card = null
      const payMethodForm = new PayMethodForm(this._$container, this._options)
      payMethodForm.render()
    })
  }

  _bindForm() {
    this._$form = this._$container.find('form')

    this._$form.on(EventName.SUBMIT, () => {
      if (this._formState.invalid) return
      const cardInstallmentsForm = new CardInstallmentsForm(this._$container, this._options)
      cardInstallmentsForm.render()
    })
  }

  _bindInputCardNumber() {
    const $inputCvv = this._$container.find(`#${Selector.INPUT_CVV}`)
    const $inputCardNumber = this._$container.find(`#${Selector.INPUT_CARD_NUMBER}`)

    $inputCardNumber
      .on(EventName.KEY_UP, async () => {
        this._options.payment.card.number = $inputCardNumber.val()

        const bins = this._options.payment.bins
        this._options.payment.card.bin = await bins.identify(this._options.payment.card.number)
        this._updateFormState()

        const cardBrand = this._options.payment.card.bin && this._options.payment.card.bin.cardBrand
        this._payMethodIconsPartial.activeIcon(cardBrand)

        const placeholder = cardBrand === 'amex' ? '0000' : '000'
        $inputCvv.attr('placeholder', placeholder)
        $inputCvv.attr('maxlength', placeholder.length)
      })
      .mask("9999999999999000000")
      .val(this._options.payment.card.number)
      .focus()
  }

  _bindInputHolderName() {
    const $inputHolderName = this._$container.find(`#${Selector.INPUT_HOLDER_NAME}`)

    $inputHolderName
      .on(EventName.KEY_UP, () => {
        const holderName = $inputHolderName.val()
        const formattedHolderName = new Textual(holderName).clearWhiteSpaces().asString()

        this._options.payment.card.holderName = formattedHolderName
        this._updateFormState()
      })
      .on(EventName.BLUR, () => $inputHolderName.val(this._options.payment.card.holderName))
      .val(this._options.payment.card.holderName)
  }

  _bindInputCvv() {
    const $inputCvv = this._$container.find(`#${Selector.INPUT_CVV}`)

    $inputCvv
      .on(EventName.KEY_UP, () => {
        this._options.payment.card.cvv = $inputCvv.val()
        this._updateFormState()
      })
      .mask("9990")
      .val(this._options.payment.card.cvv)
  }

  _bindSelectMonth() {
    const $selectMonth = this._$container.find(`#${Selector.SELECT_MONTH}`)

    for (let month = 1; month <= 12; month++) {
      const $option = $('<option/>').attr('value', month).text(String('0' + month).substr(-2))
      $selectMonth.append($option)

      if (this._options.payment.card.expirationMonth === month) {
        $option.attr('selected', true)
      }
    }

    $selectMonth.on(EventName.CHANGE, () => {
      this._options.payment.card.expirationMonth = Number($selectMonth.val())
      this._updateFormState()
    })
  }

  _bindSelectYear() {
    const $selectYear = this._$container.find(`#${Selector.SELECT_YEAR}`)
    const firstYear = new Date().getFullYear()
    const lastYear = firstYear + 20

    for (let year = firstYear; year <= lastYear; year++) {
      const $option = $('<option/>').attr('value', year).text(year)
      $selectYear.append($option)

      if (this._options.payment.card.expirationYear === year) {
        $option.attr('selected', true)
      }
    }

    $selectYear.on(EventName.CHANGE, () => {
      this._options.payment.card.expirationYear = Number($selectYear.val())
      this._updateFormState()
    })
  }

  _isValidExpirationDate() {
    const selectedMonth = this._options.payment.card.expirationMonth
    const selectedYear = this._options.payment.card.expirationYear

    if (!selectedMonth || !selectedYear) return false

    const previousMonth = new Date().getMonth() // The plugin month starts with 1
    const currentYear = new Date().getFullYear()

    return selectedYear > currentYear || selectedMonth >= previousMonth
  }

  _isValidHolderName() {
    const holderName = new Textual(this._options.payment.card.holderName)
    return !holderName.isNullOrWhiteSpace() && holderName.isProperName()
  }

  _renderInputAmount() {
    const $inputAmount = this._$container.find(`#${Selector.INPUT_AMOUNT}`)
    const disabled = !(this._options.payment.amountEditable && this._options.payment.onlyCreditEnabled)

    this._inputAmountPartial = new InputAmountPartial($inputAmount, this._options)
    this._inputAmountPartial.disabled(disabled)
    this._inputAmountPartial.render()
  }

  _renderPayMethodIcons() {
    const $payMethods = this._$container.find(`#${Selector.PAY_METHODS}`)
    const cardBrand = this._options.payment.card.bin && this._options.payment.card.bin.cardBrand

    this._payMethodIconsPartial = new PayMethodIconsPartial($payMethods)
    this._payMethodIconsPartial.render()
    this._payMethodIconsPartial.activeIcon(cardBrand)
  }

  _updateFormState() {
    this._formState = new FormState(this._$form)
    this._formState.update({
      cardNumber: !!this._options.payment.card.bin,
      holderName: this._isValidHolderName(),
      expirationDate: this._isValidExpirationDate(),
      cvv: /^\d{3,4}$/.test(this._options.payment.card.cvv)
    })
  }

  render() {
    this._$container.html(VIEW)

    this._assignInitialValues()
    this._bindButtons()
    this._bindForm()
    this._bindInputCardNumber()
    this._bindInputCvv()
    this._bindInputHolderName()
    this._bindSelectMonth()
    this._bindSelectYear()
    this._renderInputAmount()
    this._renderPayMethodIcons()
    this._updateFormState()
  }
}

export default CardOnlineForm
