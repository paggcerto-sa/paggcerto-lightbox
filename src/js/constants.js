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
  CHANGE: `change.${NAMESPACE}`,
  CLICK: `click.${NAMESPACE}`,
  KEY_UP: `keyup.${NAMESPACE}`,
  SUBMIT: `submit.${NAMESPACE}`
}

const Payment = {
  MINIMUM_BANK_SLIP_AMOUNT: 10,
  MINIMUM_CREDIT_AMOUNT: 5,
  MINIMUM_DEBIT_AMOUNT: 1
}

export {
  ID,
  Delay,
  EventName,
  NAMESPACE,
  ClassName,
  Payment
}
