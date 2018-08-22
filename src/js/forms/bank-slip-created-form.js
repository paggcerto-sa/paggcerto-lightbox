import Buffer from '../util/buffer'
import PaymentsApi from '../sdk/payments-api'
import { NAMESPACE, ClassName, EventName } from '../constants'

const Selector = {
  GROUP_DOWNLOAD: `${NAMESPACE}_groupDownload`,
  BTN_DOWNLOAD: `${NAMESPACE}_btnDownload`,
  INPUT_EMAIL: `${NAMESPACE}_receiptEmail`,
  INPUT_MOBILE: `${NAMESPACE}_receiptMobile`,
  SUCCESS_MESSAGE: `${NAMESPACE}_successMessage`
}

const VIEW = `
  <div class="${ClassName.BODY}">
    <div class="row">
      <div class="col py-6">
        <div class="form-group text-center">
          <div class="form-circle form-circle-primary mx-auto">
            <span class="icon-mark check"></span>
          </div>
          <h5 id="${Selector.SUCCESS_MESSAGE}" class="text-center mb-4"></h5>
          <div id="${Selector.GROUP_DOWNLOAD}" class="text-center">
            <button id="${Selector.BTN_DOWNLOAD}" type="button" class="btn btn-outline-primary">
              Baixar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
`

const VIEW_DOWNLOADING = `
  <div class="text-primary">
    <i>Baixando...</i>
  </div>
`

const VIEW_DOWNLOADING_COMPLETE = `
  <div class="text-primary">
    Pronto.
  </div>
`

const VIEW_DOWNLOADING_ERROR = `
  <div class="text-danger">
    O download falhou.
  </div>
`

class BankSlipCreatedForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
  }

  async render() {
    this._$container.html(VIEW)

    this._bindButtons()
    this._bindSuccessMessage()
  }

  _bindButtons() {
    this._$successMessage = this._$container.find(`#${Selector.BTN_DOWNLOAD}`)
    this._$successMessage.on(EventName.CLICK, async () => await this._download())
  }

  _bindSuccessMessage() {
    const message = this._options.payment.payers.length === 1 ?
      'Boleto emitido com sucesso!' :
      'Boletos emitidos com sucesso!'

    this._$container.find(`#${Selector.SUCCESS_MESSAGE}`).text(message)
  }

  async _download() {
    const paymentsApi = new PaymentsApi(this._options)
    const paymentIds = this._options.processedPayment.payments.map((processedPayment) => processedPayment.id)
    const $groupSubmit = this._$container.find(`#${Selector.GROUP_DOWNLOAD}`)
    const $downloadingText = $(VIEW_DOWNLOADING)

    $groupSubmit.replaceWith($downloadingText)

    try {
      let file = null
      let filename = null
      let type = null

      if (paymentIds.length === 1) {
        file = await paymentsApi.downloadPdf(paymentIds[0])
        filename = 'boleto.pdf'
        type = 'application/pdf'
      } else {
        file = await paymentsApi.downloadZip(paymentIds)
        filename = 'boletos.zip'
        type = 'application/zip'
      }

      $downloadingText.replaceWith($(VIEW_DOWNLOADING_COMPLETE))

      const buffer = new Buffer(file)
      buffer.saveToFile(type, filename)
    } catch (e) {
      $downloadingText.replaceWith($(VIEW_DOWNLOADING_ERROR))
    }
  }
}

export default BankSlipCreatedForm
