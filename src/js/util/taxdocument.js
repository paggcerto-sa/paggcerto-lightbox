import Textual from "./textual"
import { Regex } from '../constants'

class TaxDocument {
  constructor(str) {
    this._str = str || ""
  }

  isValid() {
    var validRegex = this._validRegex()
    if (!validRegex) return false
    return this._cpf(this._str) || this._cnpj(this._str)
  }

  _cpf() {
    var document = new Textual(this._str).onlyNumbers(this._str).asString()
    if (document === "" || document === null || document === undefined)
      return true

    if (document.length !== 11) {
      return false
    }

    if (document === "") return false
    if (
      document.length !== 11 ||
      document === "00000000000" ||
      document === "11111111111" ||
      document === "22222222222" ||
      document === "33333333333" ||
      document === "44444444444" ||
      document === "55555555555" ||
      document === "66666666666" ||
      document === "77777777777" ||
      document === "88888888888" ||
      document === "99999999999"
    ) {
      return false
    }

    var add = 0
    for (var i = 0; i < 9; i++) {
      add += parseInt(document.charAt(i)) * (10 - i)
    }
    var rev = 11 - (add % 11)

    if (rev === 10 || rev === 11) {
      rev = 0
    }

    if (rev != parseInt(document.charAt(9))) {
      return false
    }

    add = 0
    for (i = 0; i < 10; i++) {
      add += parseInt(document.charAt(i)) * (11 - i);
    }
    rev = 11 - (add % 11)

    if (rev === 10 || rev === 11) {
      rev = 0
    }

    if (rev != parseInt(document.charAt(10))) {
      return false
    }

    return true
  }

  _cnpj() {
    var document = new Textual(this._str).onlyNumbers(this._str).asString()
    if (document === "" || document === null || document === undefined)
      return true

    if (document.length !== 14) {
      return false
    }

    if (
      document === "00000000000000" ||
      document === "11111111111111" ||
      document === "22222222222222" ||
      document === "33333333333333" ||
      document === "44444444444444" ||
      document === "55555555555555" ||
      document === "66666666666666" ||
      document === "77777777777777" ||
      document === "88888888888888" ||
      document === "99999999999999"
    ) {
      return false
    }

    var length = document.length - 2
    var numbers = document.substring(0, length)
    var digits = document.substring(length)
    var sum = 0
    var pos = length - 7

    for (var i = length; i >= 1; i--) {
      sum += numbers.charAt(length - i) * pos--
      if (pos < 2) {
        pos = 9
      }
    }
    var result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result != digits.charAt(0)) {
      return false
    }

    length = length + 1
    numbers = document.substring(0, length)
    sum = 0
    pos = length - 7
    for (i = length; i >= 1; i--) {
      sum += numbers.charAt(length - i) * pos--
      if (pos < 2) {
        pos = 9
      }
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result != digits.charAt(1)) {
      return false
    }

    return true
  }

  _validRegex() {
    var regexCpf = new RegExp(Regex.CPF)
    var regexCnpj = new RegExp(Regex.CNPJ)

    return regexCpf.test(this._str) || regexCnpj.test(this._str)
  }
}

export default TaxDocument
