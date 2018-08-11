const SandboxUrl = {
  BINS: 'http://payments.sandbox.paggcerto.com.br/api/v2/bins',
  PAY_WITH_CARDS: 'http://payments.sandbox.paggcerto.com.br/api/v2/pay/cards',
  SEND_CARD_RECEIPT: 'http://payments.sandbox.paggcerto.com.br/api/v2/card-transactions/:nsu/send-receipt'
}

const ProductionUrl = {
  BINS: 'http://payments.paggcerto.com.br/api/v2/bins',
  PAY_WITH_CARDS: 'http://payments.paggcerto.com.br/api/v2/pay/cards',
  SEND_CARD_RECEIPT: 'http://payments.paggcerto.com.br/api/v2/card-transactions/:nsu/send-receipt'
}

class Environment {
  constructor(options) {
    if (options.environment === 'sandbox') this.Url = SandboxUrl
    if (options.environment === 'production') this.Url = ProductionUrl
  }
}

export default Environment
