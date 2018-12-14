import { Regex } from "../constants"

class Phone {
  constructor(str) {
    this._str = str || null
  }

  isValid() {
    var regex = new RegExp(Regex.PHONE)
    if (this._str == "") return false

    return regex.test(this._str)
  }
}

export default Phone
