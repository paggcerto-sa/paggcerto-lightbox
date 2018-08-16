import { EventName } from '../constants'

class FormState {
  constructor($form) {
    this._$form = $form.on(EventName.SUBMIT, (e) => e.preventDefault())
    this._$submitButton = $form.find(':submit')
    this._current = {}
    this.invalid = false
  }

  isValid(field) {
    return this._current[field]
  }

  update(newState) {
    Object.assign(this._current, newState)

    for (let field in this._current) {
      if (!this._current[field]) {
        this.invalid = true
        this._$submitButton.attr('disabled', true)
        return
      }
    }

    this._$submitButton.removeAttr('disabled')
    this.invalid = false
  }
}

export default FormState
