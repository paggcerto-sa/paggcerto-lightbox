import { ClassName, NAMESPACE } from "../constants"

const Selector = {
  UL_ERRORS: `${NAMESPACE}_ulOccurrences`,
}


const VIEW = `
  <div class="${ClassName.BODY}">
    <div class="row">
      <div class="col border-right py-6">
        <div class="form-group text-center">
          <div class="form-circle form-circle-danger mx-auto">
            <span class="icon-mark exclamation"></span>
          </div>
          <h5 class="mb-4">
            Contate o administrador.
          </h5>
        </div>
      </div>
      <div class="col py-6">
        <div class="w-100">
            <strong class="h4">Ocorrências identificadas:</strong>
            <ul id=${Selector.UL_ERRORS} class="mt-3">
            </ul>
        </div>
      </div>
    </div>
  </div>
`;

class ErrorOptionsForm {
  constructor($container, options) {
    this._$container = $container
    this._options = options
  }

  render () {
    this._$container.html(VIEW)

    const ul = this._$container.find(`#${Selector.UL_ERRORS}`);
    for (let index = 0; index < this._options.errors.length; index++) {
      ul.prepend(`<li>${this._options.errors[index].message}</li>`)
    }
  }
}

export default ErrorOptionsForm
