const Sandbox = {
  BINS: 'http://payments.sandbox.paggcerto.com.br/api/v2/bins',
  PAY_WITH_CARDS: 'http://payments.sandbox.paggcerto.com.br/api/v2/pay/cards',
  SEND_CARD_RECEIPT: 'http://payments.sandbox.paggcerto.com.br/api/v2/card-transactions/:nsu/send-receipt'
}

const Production = {
  BINS: 'http://payments.paggcerto.com.br/api/v2/bins',
  PAY_WITH_CARDS: 'http://payments.paggcerto.com.br/api/v2/pay/cards',
  SEND_CARD_RECEIPT: 'http://payments.paggcerto.com.br/api/v2/card-transactions/:nsu/send-receipt'
}

export {
  Sandbox,
  Production
}
