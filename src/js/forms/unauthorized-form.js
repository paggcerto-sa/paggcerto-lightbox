import { ClassName } from 'src/js/constants'

const VIEW = `
  <div class="${ClassName.BODY}">
    <div class="row">
      <div class="col border-right py-6">
        <div class="form-group text-center">
          <div class="form-circle form-circle-danger mx-auto">
            <span class="icon-mark exclamation"></span>
          </div>
          <h5 class="text-danger">
            Pagamento não autorizado.
          </h5>
        </div>
      </div>
      <div class="col py-6">
        <div class="ml-auto w-75">
          <h5 class="text-secondary text-right mb-5">
            O pagamento não pôde ser inciado. Por favor contate a equipe responsável.
          </h5>
        </div>
      </div>
    </div>
  </div>
`

class UnauthorizedForm {
  constructor($container) {
    this._$container = $container
  }

  render() {
    this._$container.html(VIEW)
  }
}

export default UnauthorizedForm
