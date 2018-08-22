const SandboxUrl = {
  BANK_SLIP_PDF: 'http://payments.sandbox.paggcerto.com.br/api/v2/bank-slips/pdf/{paymentId}',
  BANK_SLIP_ZIP: 'http://payments.sandbox.paggcerto.com.br/api/v2/bank-slips/zip?{payments}',
  BINS: 'http://payments.sandbox.paggcerto.com.br/api/v2/bins',
  PAY_WITH_CARDS: 'http://payments.sandbox.paggcerto.com.br/api/v2/pay/cards',
  PAY_WITH_BANK_SLIPS: 'http://payments.sandbox.paggcerto.com.br/api/v2/pay/bank-slips',
  SEND_CARD_RECEIPT: 'http://payments.sandbox.paggcerto.com.br/api/v2/card-transactions/send-receipt/{nsu}'
}

const ProductionUrl = {
  BANK_SLIP_PDF: 'https://payments.paggcerto.com.br/api/v2/bank-slips/pdf/{paymentId}',
  BANK_SLIP_ZIP: 'https://payments.paggcerto.com.br/api/v2/bank-slips/zip?{payments}',
  BINS: 'https://payments.paggcerto.com.br/api/v2/bins',
  PAY_WITH_CARDS: 'https://payments.paggcerto.com.br/api/v2/pay/cards',
  PAY_WITH_BANK_SLIPS: 'https://payments.paggcerto.com.br/api/v2/pay/bank=slips',
  SEND_CARD_RECEIPT: 'https://payments.paggcerto.com.br/api/v2/card-transactions/send-receipt/{nsu}'
}

class Environment {
  constructor(options) {
    if (options.environment === Environment.Sandbox) this.Url = SandboxUrl
    if (options.environment === Environment.Production) this.Url = ProductionUrl
  }
}

Environment.Sandbox = 'sandbox'
Environment.Production = 'production'

export default Environment
