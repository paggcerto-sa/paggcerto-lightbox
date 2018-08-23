import { waitOrTimeout } from '../util/async'
import Environment from './environment';
import SerialWebsocket from './serial-websocket'

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

export class PinpadService {

  constructor(options, attempts) {
    this.connected = false
    this._attempts = attempts || 5
    this._environment = new Environment(options)
  }

  async connect() {

    if (this.connected) return true

    window.location.assign(`paggcertoconnector:${this._environment.PinpadUrl}`)

    for (var i = 0; i < this._attempts; i++) {

      this.websocket = new SerialWebsocket('ws://127.0.0.1:7777')
      this.connected = await this.websocket.connect()

      if (this.connected) return true
    }

    this.websocket = null

    return false
  }

  async listDevices() {

    const response = await this.websocket.sendAndWait(new ListDevicesRequest().toString())

    if (response === null) return null

    const json = JSON.parse(response.data)

    if (json.type === 'DEVICE_LIST') {

      const devices = []

      for (let device of json.data) {

        if (!this._isXPos(device)) continue

        devices.push(device)
      }

      return devices
    }

    return null
  }

  async readCard(amount, device, credit) {

    const readCardRequest = new ReadCardRequest(amount, device, credit)

    if (!this.websocket.send(readCardRequest.toString())) {
      return null
    }

    for (;;) {
      const response = await waitOrTimeout(this.websocket.read(), TIMEOUT)

      if (response === null) return { success: false, data: null }

      const json = JSON.parse(response.data)

      switch(json.type) {
        case 'CONNECTION_STABLISHED':
        case 'INSERT_CARD':
        case 'DEVICE_MSG':
          break

        case 'CARD_INFORMATION': return { success: true, data: json.data }

        default: return { success: false, data: json }
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

      if (response === null) return { success: false, data: null }

      const json = JSON.parse(response.data)

      switch(json.type) {

        case 'TRANSACTION_RESPONSE': return { success: true, data: json.data }

        case 'OPERATION_CANCELED':
        case 'FAIL':
          return { success: false, data: json }

        default:
          statusCallback(json.type, json.data)
          break
      }
    }
  }

  async close() {

    if (this.websocket === null) return

    await this.websocket.close()

    this.websocket = null
  }

  _isXPos(device) {
    return device !== null &&
      device.manufacturer !== null &&
      device.manufacturer.toUpperCase().match(/PAX|GERTEC/) !== null;
  }
}

export default PinpadService
