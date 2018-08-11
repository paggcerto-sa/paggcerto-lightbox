import { NAMESPACE, ClassName } from 'src/js/constants'

const Selector = {
  RECEIPT_EMAIL: `${NAMESPACE}_receipt-email`,
  RECEIPT_MOBILE: `${NAMESPACE}_receipt-mobile`
}

const VIEW = `
  <div class="${ClassName.BODY}">
    <div class="row">
      <div class="col border-right py-6">
        <div class="form-group text-center">
          <div class="form-circle form-circle-primary mx-auto">
            <span class="icon-mark check"></span>
          </div>
          <h5 class="text-primary">
            Transação aprovada!
          </h5>
        </div>
      </div>
      <div class="col py-6">
        <form class="ml-auto w-75">
          <h5 class="text-secondary text-right mb-5">
            Enviar comprovante por e-mail e/ou SMS:
          </h5>
          <div class="form-group">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">@</span>
              </div>
              <input id="${Selector.RECEIPT_EMAIL}" type="text" class="form-control" placeholder="Endereço de e-mail">
            </div>
          </div>
          <div class="form-group">
            <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text">&#9993;</span>
                </div>
              <input id="${Selector.RECEIPT_MOBILE}" type="text" class="form-control" placeholder="Número do celular">
            </div>
          </div>
          <div class="form-group d-flex">
            <button type="button" class="btn btn-primary ml-auto px-5">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
`;

class CardSuccessForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
  }

  async render() {
    this._$container.html(VIEW)
  }
}

export default CardSuccessForm
