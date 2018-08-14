const AccentsHexadecimal = {
  a: /[\xE0-\xE6]/g,
  A: /[\xC0-\xC6]/g,
  e: /[\xE8-\xEB]/g,
  E: /[\xC8-\xCB]/g,
  i: /[\xEC-\xEF]/g,
  I: /[\xCC-\xCF]/g,
  o: /[\xF2-\xF6]/g,
  O: /[\xD2-\xD6]/g,
  u: /[\xF9-\xFC]/g,
  U: /[\xD9-\xDC]/g,
  c: /\xE7/g,
  C: /\xC7/g,
  n: /\xF1/g,
  N: /\xD1/g
}

class Textual {
  constructor(str) {
    this._str = str || ''
  }

  clearWhiteSpaces() {
    const formattedStr = this._str.trim().replace(/\s+/g, ' ')
    return new Textual(formattedStr)
  }

  isNullOrWhiteSpace() {
    return this._str === null || this._str === undefined || !!this._str.match(/^ *$/)
  }

  removeAccents() {
    let formattedStr = this._str

    for (let letter in AccentsHexadecimal) {
      const expression = AccentsHexadecimal[letter]
      formattedStr = this._str.replace(expression, letter)
    }

    return new Textual(formattedStr)
  }

  onlyNumbers() {
    const formattedStr = this._str.replace(/[^\d]/g, '')
    return new Textual(formattedStr)
  }

  isProperName() {
    const nonaccent = this.removeAccents().clearWhiteSpaces().asString()
    const isNonaccent = /^[a-zA-Z'\s]*$/.test(nonaccent)
    const hasAtLeastTwoWords = nonaccent.split(' ').length >= 2

    return isNonaccent && hasAtLeastTwoWords
  }

  asString() {
    return this._str
  }
}

export default Textual
