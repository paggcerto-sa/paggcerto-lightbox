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
    if (options.environment === Environment.Sandbox)
    {
      this.Url = SandboxUrl
      this.PinpadUrl = 'gAAAAABbfxNNkuON4VIFsasuS_Vj5TAivLpkUuhHTMpKPF3zGxeZFiOqt5z7JP0DB12Z9GteERV7IyUDMgYdigudFXN2IP997nvgGMUZQhVILaHD0SagyUH98BMsEetbS6GY4bE9ougf3XJ3Zyh5HCRWOhE4xwzivQ5Bc9czIdNikh0pu1uGis3mLr8t-tklpiWW2MOOu10JIKLkaFppjiA7c64o-3SUIpb9VWgA2SDyHmkZFsCbfvTw1Pqi6NkH9xZhL-zGtxVl62nqr21WFfqBtUkicGIpRgRVyoyESDkTRoCi03Wk7bl0whrmMo8RdBUE2EFh6PFNP8tmacbQD61cKh7xt6xRHAX8ZnAwJ0S3JADqQP1rdHh2Y75eaRW01BKTV3i2qad_'
    } else if (options.environment === Environment.Production) {
      this.Url = ProductionUrl
      this.PinpadUrl = 'gAAAAABbfxNNkanj_1hds4DsWZ7SGohEPq9c0Tsg7wgwCNyLt-Ayfl7w9CpjyLixy2owofoDCZ9TTQialg1_pc7LjZkV99ormxRAzqUqm6O7U0gzvbpS-EhMljUHpbee7A-pZXEwLezYk4cku6a8Am5XRjBcV65XKMKFVi2iVyccHjIfXrwzMVNgIAmGWIceZ6OKlyX5Y_3R2_s9JkpMGFY1PuFrEYqs1uI_vs010fk8iYXfw98_Tym2eVOf7jsujGmW9A4GNLN1kDH93IZNVhr_aKtHIr6MhQwTtRX1UJbxIeosCe5o0G0ruSUJuOpipalIm833IU86RkhB-U9Vx_D2udDCsNbnOzbYeNQk7_RECXS70osO3XE-YFNzyjelZlalLNNuouNL'
    }
  }
}

Environment.Sandbox = 'sandbox'
Environment.Production = 'production'

export default Environment
