import { _isNullOrUndefined, _isNumberPositive } from "./annotations"
import { Regex } from "../constants"
import moment from "moment"

class DateDue {
  constructor(str) {
    this._str = str || null
    this._regex = new RegExp(Regex.DATE)
    this._today = moment()
    this._due = null,
    this._diffDays = null
  }

  isValid() {
    if (_isNullOrUndefined(this._str)) return false

    var result = this._regex.test(this._str)
    if (!result) return false

    this._due = moment(this._str, 'DD/MM/YYYY')
    this._diffDays = this._due.diff(this._today, 'days', true) + 1

    if (!_isNumberPositive(this._diffDays) || this._diffDays <= 1) return false

    return result
  }
}

export default DateDue
