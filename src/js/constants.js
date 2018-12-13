const NAMESPACE = "paggcerto"
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
  thousands: ".",
  decimal: ","
}

const PaymentLimit = {
  BANK_SLIP_INSTALLMENTS_MAXIMUM: 12,
  BANK_SLIP_AMOUNT_MINIMUM: 6,
  CREDIT_AMOUNT_MINIMUM_SINGLE_INSTALLMENT: 1,
  CREDIT_AMOUNT_MINIMUM_MULTIPLE_INSTALLMENT: 5,
  DEBIT_AMOUNT_MINIMUM: 1,
  CREDIT_INSTALLMENTS_MAXIMUM: 12,
  MAX_CARACTERES_INSTRUCTIONS: 255,
  MAX_DISCOUNT_DAYS: 30,
  MAX_ACCEPTED_UNTIL: 25,
  MAX_SELLING_KEY: 50,
  MAX_BANK_SLIP_FINES: 20,
  MIN_BANK_SLIP_FINES: 0.25,
  MAX_BANK_SLIP_INTEREST: 20,
  MIN_BANK_SLIP_INTEREST: 0.25,
  MAX_DUE_DAYS: 365
}

const Regex = {
  CNPJ: `\\d{2}\\.\\d{3}\\.\\d{3}\/\\d{4}\\-\\d{2}`,
  CPF: `^\\d{3}\\.\\d{3}\\.\\d{3}\\-\\d{2}`,
  EMAIL: `^[\\.\\w-]+@([\\w-]+\\.)+[\\w-]+$`,
  PHONE: `^\\([1-9]{2}\\) (?:[2-8][0-9]|9[1-9])[0-9]{2,3}\\-[0-9]{4}$`,
  DATE: `^([0-2][0-9]|(3)[0-1])(\\/)(((0)[0-9])|((1)[0-2]))(\\/)\\d{4}$`
}

export {
  ID,
  NAMESPACE,
  ClassName,
  Delay,
  EventName,
  MaskMoney,
  PaymentLimit,
  Regex
}
