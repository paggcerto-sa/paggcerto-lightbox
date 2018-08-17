import SerialWebsocket from './serial-websocket'
import { timeoutAsync, waitOrTimeout } from '../util/async'

const URL_SANDBOX = 'gAAAAABbd01KmSckvwQPGzXvUphnl3kurGhq3l_sfxRIK5NGeQQNmrEUqCWQYy83NM9-C1tc1Sa4XxC151LMenbl0rYWq-NoajGkZoU7gTGJkSH5stsX7pYtlu0T6XOafoHvjaFfMJJ0fPZFlLRrxg1OtUcKv2S2mrDLoolN_oBrIFeP1Yd3ooYGrVW-QjoXtTrf28l_Txf0Xv1uO-2ebi3p_0Ohy0ynTb9xQZYV0Gsufb1u7t9N16l-tv-5Y-_3J3ss_4rPZnkfbLz2esIb6pG-l5zl6Z25FskNBGe_J2keh5chvWfI3T6DPXoeDZTqLztTQNS5KQBzjPav4-qdW-5sj3mA7m01aSMpnQ6YZu0Cc29gwbTYkDHxS2M_rv0gS6JYw6NGXfkq'
const TIMEOUT = 30000

class ReadCardRequest {
  constructor(amount, device, credit) {
    this.type = 'READ_CARD'
    this.amount = amount
    this.device = device
    this.credit = credit
  }

  toString() {
    return JSON.stringify(this)
  }
}

class PaymentRequest {
  constructor(sellingkey, installments, token) {
    this.type = 'TRANSACTION'
    this.sellingkey = sellingkey
    this.installments = installments
    this.token = token
  }

  toString() {
    return JSON.stringify(this)
  }
}

class ListDevicesRequest {
  constructor() {
    this.type = 'LIST_DEVICES'
  }

  toString() {
    return JSON.stringify(this)
  }
}

export class Pinpad {

  constructor(attempts) {
    this.connected = false
    this.attempts = attempts || 5
  }

  async connect() {

    if (this.connected) return true

    window.location.assign(`paggcertoconnector:${URL_SANDBOX}`)

    for (var i = 0; i < 10; i++) {
      this.websocket = new SerialWebsocket('ws://127.0.0.1:7777')
      this.connected = await this.websocket.connect()
      await timeoutAsync(200)
    }

    return this.connected
  }

  async listDevices() {

    const response = await this.websocket.sendAndWait(new ListDevicesRequest().toString())

    if (response === null) return null

    const json = JSON.parse(response.data)

    if (json.type === 'DEVICE_LIST') return json.data

    return null
  }

  async readCard(amount, device, credit) {

    const readCardRequest = new ReadCardRequest(amount, device, credit)

    if (!this.websocket.send(readCardRequest.toString())) {
      return null
    }

    for (;;) {

      const response = await waitOrTimeout(this.websocket.read(), TIMEOUT)

      if (response === null) return null

      const json = JSON.parse(response.data)

      switch(json.type) {

        case 'CONNECTION_STABLISHED':
        case 'INSERT_CARD':
          break

        case 'CARD_INFORMATION': return json.data

        default: return null
      }
    }
  }

  async pay(sellingkey, installments, token, statusCallback) {

    statusCallback = statusCallback || (() => {})

    const paymentRequest = new PaymentRequest(sellingkey, installments, token)

    if (!this.websocket.send(paymentRequest.toString())) {
      return null
    }

    for(;;) {

      const response = await waitOrTimeout(this.websocket.read(), TIMEOUT)

      if (response === null) return null

      const json = JSON.parse(response.data)

      switch(json.type) {

        case 'TRANSACTION_RESPONSE': return json.data
        case 'FAIL': return null

        default:
          statusCallback(json.type, json.data)
          break
      }
    }
  }

  close() {
    if (this.websocket === null) return
    this.websocket.close()
  }
}

export default Pinpad
