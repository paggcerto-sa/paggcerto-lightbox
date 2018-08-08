class StateValidation {
  constructor($submitButton) {
    this._$submitButton = $submitButton
    this._current = {}
  }

  isValid(field) {
    return this._current[field]
  }

  update(newState) {
    Object.assign(this._current, newState)

    for (let field in this._current) {
      if (!this._current[field]) {
        this._$submitButton.attr('disabled', true)
        return
      }
    }

    this._$submitButton.removeAttr('disabled')
  }
}

export default StateValidation
