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

const Event = {
  CLICK: `click.${NAMESPACE}`
}

const Payment = {
  MINIMUM_BANK_SLIP_AMOUNT: 10,
  MINIMUM_CREDIT_AMOUNT: 5,
  MINIMUM_DEBIT_AMOUNT: 1
}

export {
  ID,
  Event,
  NAMESPACE,
  ClassName,
  Payment
}
