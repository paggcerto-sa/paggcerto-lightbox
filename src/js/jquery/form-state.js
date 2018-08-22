import { EventName, ID } from '../constants'

const Selector = {
  ERROR_SUMMARY: '.alert',
  FORM: 'form'
}

class FormState {
  constructor($container) {
    this._$form = $container.find(Selector.FORM).on(EventName.SUBMIT, (e) => this._validateBeforeSubmit(e))
    this._$errorSummary = $container.find(Selector.ERROR_SUMMARY)
    this._$submitButton = this._$form.find(':submit')
    this._current = {}
    this._touches = {}
    this._submited = false
    this.invalid = false
  }

  isValid(field) {
    return this._current[field]
  }

  touch(touched) {
    Object.assign(this._touches, touched)
  }

  update(newState) {
    this._$errorSummary.empty()
    this.invalid = false

    Object.assign(this._current, newState)

    for (let fieldName in this._current) {
      const field = this._current[fieldName]

      if (!field.valid) {
        if (this._touches[fieldName]) {
          this._addErrorMessage(field.message)
        }

        this.invalid = true
      }
    }

    this._toggleErrorSummary()
  }

  _addErrorMessage(message) {
    const $message = $('<div/>').text(message)
    this._$errorSummary.append($message)
  }

  _toggleErrorSummary() {
    const hasErrorMessage = this._$errorSummary.children().length > 0
    this._$errorSummary.toggleClass('d-none', !hasErrorMessage)
  }

  _validateBeforeSubmit(e) {
    e.preventDefault()

    for (let fieldName in this._current) {
      this._touches[fieldName] = true;
    }

    this._submited = true
    this.update({})
  }
}

export default FormState
