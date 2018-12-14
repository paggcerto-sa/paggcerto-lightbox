import { Regex } from "../constants"

class Email {
  constructor(str) {
    this._str = str || null
  }

  isValid() {
    var regex = new RegExp(Regex.EMAIL)

    if (this._str == "") return false

    return regex.test(this._str)
  }
}

export default Email
