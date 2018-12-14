import { NAMESPACE, ClassName } from '../constants'
import CardInstallmentForm from './card-installments-form'
import CardOnlineForm from './card-online-form';
import ErrorForm from './error-form'
import InitPaymentForm from './init-payment-form';
import InputAmountPartial from '../partials/input-amount-partial'
import PayMethodIconsPartial from '../partials/pay-method-icons-partial'
import PinpadProcessingForm from './pinpad-processing-form';
import { _isNullOrUndefined } from '../util/annotations';

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
    <p>Insira o seu cartão</p>
  </div>
  <div class="${ClassName.BODY}">
    <div class="row">
      <div class="col border-right">
        <div class="form-group">
          <span id="${Selector.INPUT_AMOUNT}"></span>
        </div>
      </div>
      <div class="col">
        <div class="device-icon insert-card"></div>
      </div>
    </div>
  </div>
  <div class="${ClassName.FOOTER} text-center">
    <span id="${Selector.PAY_METHODS}"></span>
  </div>
`

export class PinpadForm {

  constructor($container, options) {
    this._$container = $container
    this._options = options
    this._router = null
    this._cardInformation = null
  }

  async render(router) {
    this._router = router

    this._$container.html(VIEW)
    this._renderInputAmount()
    this._renderPayMethodIcons()

    await this._process()
  }

  async _process() {
    const devices = await this._options.pinpad.listDevices()

    if (devices === null || devices.length === 0) return this._renderProcessingFail()

    const device = devices[0].port

    const response = await this._options.pinpad.readCard(this._options.payment.amount, device, this._options.payment.credit)

    if (!response.success) return this._handleResponseError(response)

    this._cardInformation = response.data

    await this._createPaymentCard()

    if (!this._isCardSupported()) return this._renderCardNotSupported()

    if (!this._options.payment.credit) return this._processDebit()

    if (this._shouldRedirectToOnline()) return this._redirectToTyped()

    if (this._shouldForceChip()) return this._renderForceChipUse()

    if (this._shouldProcessBaneseCredit()) this._processBaneseCredit()

    this._goTo(CardInstallmentForm)
  }

  _processDebit() {

    if(!this._isDebitAllowed()) return this._renderOperationNotSupported()
    if (this._shouldForceChip()) return this._renderForceChipUse()

    this._options.payment.installments = 1
    this._goTo(PinpadProcessingForm)
  }

  _processBaneseCredit() {
    this._options.ask_password = false
  }

  _shouldRedirectToOnline() {
    return !this._options.payment.card.bin.emvSupported ||
      this._isAmexCard() ||
      this._isHiperCard()
  }

  _shouldForceChip() {
    return this._cardInformation.hasChip && !this._cardInformation.chipWasUsed
  }

  _shouldProcessBaneseCredit() {
    return this._options.payment.credit && this._isBaneseCard()
  }

  _handleResponseError(response) {

    if (response.data === null) return this._renderProcessingFail()

    switch(response.data.type) {
      case 'UNSUPPORTED_OPERATION': return this._renderOperationNotSupported()
      case 'OPERATION_CANCELED': return this._renderOperationCanceled()
    }

    return this._renderProcessingFail()
  }

  async _createPaymentCard() {
    this._options.payment.card = {
      number: this._cardInformation.cardNumber,
      bin: await this._options.payment.bins.identify(this._cardInformation.cardNumber),
      holderName: this._cardInformation.holderName,
      expirationMonth: new Date(this._cardInformation.expirationDate).getMonth() + 1,
      expirationYear: new Date(this._cardInformation.expirationDate).getFullYear(),
      installments: _isNullOrUndefined(this._options.payment.card) ? null
        : _isNullOrUndefined(this._options.payment.card.installments) ? null
        : this._options.payment.card.installments
    }
  }

  _goTo(form) {
    this._router.render(form, this._$container, this._options)
  }

  _isCardSupported() {
    return this._options.payment.card.bin !== null
  }

  _isDebitAllowed() {
    const bin = this._options.payment.card.bin
    return bin.debit && (this._isBaneseCard() || bin.emvSupported)
  }

  _isBaneseCard() {
    return this._options.payment.card.bin.cardBrand === 'banesecard'
  }

  _isHiperCard() {
    return this._options.payment.card.bin.cardBrand === 'hipercard'
  }

  _isAmexCard() {
    return this._options.payment.card.bin.cardBrand === 'amex'
  }

  _renderInputAmount() {
    const $inputAmount = this._$container.find(`#${Selector.INPUT_AMOUNT}`)
    const inputAmountPartial = new InputAmountPartial($inputAmount, this._options)
    inputAmountPartial.disabled(true)
    inputAmountPartial.render()
  }

  _renderPayMethodIcons() {
    const $payMethods = this._$container.find(`#${Selector.PAY_METHODS}`)
    const payMethodIconsPartial = new PayMethodIconsPartial($payMethods)
    payMethodIconsPartial.render()
  }

  _renderOperationCanceled() {
    return this._renderGenericErrorMessage('Operação Cancelada.', 'Operação Cancelada pelo usuário.')
  }

  _renderForceChipUse() {
    return this._renderGenericErrorMessage('Metodo Inválido.', 'Utilize o CHIP.')
  }

  _renderOperationNotSupported() {
    return this._renderGenericErrorMessage('Operação Inválida.', 'Modalidade não suportada pelo cartão.')
  }

  _renderCardNotSupported() {
    return this._renderGenericErrorMessage('Cartão Inválido.', 'Este cartão não é suportado.')
  }

  _renderProcessingFail() {
    return this._renderGenericErrorMessage('Falha no processamento.', 'Não foi possível efetuar o processamento.')
  }

  _renderGenericErrorMessage(primaryMessage, secondaryMessage) {
    const config = {
      primaryMessage,
      secondaryMessage,
      buttons : [
        {
          label: 'Voltar a tela inicial',
          onClick: () => {
            this._goTo(InitPaymentForm)
          }
        }
      ]
    }

    this._router.render(ErrorForm, this._$container, config)
  }

  async _redirectToTyped() {
    this._options.payment.redirected = true
    this._goTo(CardOnlineForm)
  }
}

export default PinpadForm
