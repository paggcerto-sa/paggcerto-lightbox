import $ from 'jquery'

const ClassName = {
  ICON: 'icon-pay-method'
}

const VIEW = `
  <div class="pay-method-icons">
    <span class="${ClassName.ICON} visa"></span>
    <span class="${ClassName.ICON} mastercard"></span>
    <span class="${ClassName.ICON} elo"></span>
    <span class="${ClassName.ICON} dinersclub"></span>
    <span class="${ClassName.ICON} hipercard"></span>
    <span class="${ClassName.ICON} amex"></span>
    <span class="${ClassName.ICON} banese"></span>
    <span class="${ClassName.ICON} bank-slip"></span>
  </div>
`

class PayMethodIconsPartial {
  constructor($container) {
    this._$container = $container
  }

  render() {
    this._$paymentIcons = $(VIEW)
    this._$container.replaceWith(this._$paymentIcons)
    this._activeAllIcons()
  }

  activeIcon(payMethod) {
    this._$paymentIcons.children().removeClass('active')
    this._$paymentIcons.find(`.${ClassName.ICON}.${payMethod}`).addClass('active')
  }

  _activeAllIcons() {
    this._$paymentIcons.children().addClass('active')
  }
}

export default PayMethodIconsPartial
