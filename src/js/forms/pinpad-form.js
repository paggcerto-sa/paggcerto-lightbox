import { NAMESPACE, ClassName } from '../constants'
import CardInstallmentForm from './card-installments-form'
import CardOnlineForm from './card-online-form';
import ErrorForm from './error-form'
import InitPaymentForm from './init-payment-form';
import InputAmountPartial from '../partials/input-amount-partial'
import PayMethodIconsPartial from '../partials/pay-method-icons-partial'
import PinpadProcessingForm from './pinpad-processing-form';

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
        <!-- imagem da maquininha --->
        <h1>Insira o cartao</h1>
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

    console.log('Rendering PinpadForm')

    this._router = router

    this._$container.html(VIEW)
    this._renderInputAmount()
    this._renderPayMethodIcons()

    await this._process()

    console.log('Rendered PinpadForm')
  }

  async _process() {

    const devices = await this._options.pinpad.listDevices()

    if (devices === null || devices.length === 0) return this._renderProcessingFail()

    const device = devices[0].port
    const response = await this._options.pinpad.readCard(this._options.payment.amount, device, this._options.payment.credit)

    if (!response.success) return this._handleResponseError(response)

    this._cardInformation = response.data
    console.log('response:', response)

    await this._createPaymentCard()

    if (!this._isCardSupported()) return this._renderCardNotSupported()

    if (!this._options.payment.credit) return this._processDebit()

    if (this._shouldRedirectToOnline()) return this._redirectToTyped()

    if (this._shouldForceChip()) return this._renderForceChipUse()

    this._goTo(CardInstallmentForm)
  }

  _processDebit() {

    if(!this._isDebitAllowed()) return this._renderOperationNotSupported()
    if (this._shouldForceChip()) return this._renderForceChipUse()

    this._options.payment.installments = 1
    this._goTo(PinpadProcessingForm)
  }

  _shouldRedirectToOnline() {
    return !this._options.payment.card.bin.emvSupported ||
      this._isBaneseCard() ||
      this._isAmexCard() ||
      this._isHiperCard()
  }

  _shouldForceChip() {
    return this._cardInformation.hasChip && !this._cardInformation.chipWasUsed
  }

  _handleResponseError(response) {
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
      expirationYear: new Date(this._cardInformation.expirationDate).getFullYear()
    }

    console.log(this._options.payment.card)
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
    inputAmountPartial.disabled(!this._options.payment.amountEditable)
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
            this._cleanup()
            this._goTo(InitPaymentForm)
          }
        }
      ]
    }

    this._router.render(ErrorForm, this._$container, config)
  }

  _redirectToTyped() {
    this._cleanup()
    this._options.payment.redirected = true
    this._goTo(CardOnlineForm)
  }

  _cleanup() {
    if (this._options !== null) {
      this._options.pinpad.close()
      this._options.pinpad = null
    }
  }
}

export default PinpadForm
