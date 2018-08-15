const NAMESPACE = 'paggcerto'
const ID = `${NAMESPACE}-lightbox`

const ClassName = {
  BACKDROP: `${ID}-backdrop`,
  BTN_CLOSE: `${ID}-close`,
  DIALOG: `${ID}-dialog`,
  CONTENT: `${ID}-content`,
  HEADER: `${ID}-header`,
  BODY: `${ID}-body`,
  FOOTER: `${ID}-footer`,
  SHOW: `${ID}-show`
}

const Delay = {
  LIGHTBOX_SHOW_ANIMATION: 50,
  INPUT_AMOUNT_FOCUS: 75
}

const EventName = {
  BLUR: `blur.${NAMESPACE}`,
  CHANGE: `change.${NAMESPACE}`,
  CLICK: `click.${NAMESPACE}`,
  KEY_UP: `keyup.${NAMESPACE}`,
  SUBMIT: `submit.${NAMESPACE}`,
  DRAG_DROP: `dragenter.${NAMESPACE} dragover.${NAMESPACE} drop.${NAMESPACE}`
}

const MaskMoney = {
  affixesStay: true,
  allowZero: true,
  allowNegative: false,
  thousands: '.',
  decimal: ','
}

const PaymentLimit = {
  BANK_SLIP_INSTALLMENTS_MAXIMUM: 12,
  BANK_SLIP_AMOUNT_MINIMUM: 10,
  CREDIT_AMOUNT_MINIMUM_SINGLE_INSTALLMENT: 1,
  CREDIT_AMOUNT_MINIMUM_MULTIPLE_INSTALLMENT: 5,
  DEBIT_AMOUNT_MINIMUM: 1
}

export {
  ID,
  NAMESPACE,
  ClassName,
  Delay,
  EventName,
  MaskMoney,
  PaymentLimit
}
