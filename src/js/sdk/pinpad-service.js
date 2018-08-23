import { waitOrTimeout } from '../util/async'
import SerialWebsocket from './serial-websocket'

const URL_SANDBOX = 'gAAAAABbfGgddqsnR1JSV-ME7O67gWMcro1wm6y24np4z9JsH6JdlbmF0B6BDbkmv40QiHhWibrTeNGqpK3bePZPIWg5rkrKFYln2IbULtTggKeC8wGNNYW6RBzKTZ96aNpzAu2iHwikZ1opvBwmB9MV_Uc3f-AwA2WfB6J0oqWdzcEk13U3jju3KIh6zeS7m_FAm8OmlLKqUBKmwuTdaPw-ScJLpJ47LxVHLVEAiUEDL59Jhy4LpJ4ffRuj3ufsMFlFdGR9kMFPBItdXugDhSCDpGUog8TJX23X0kPiD0I5006Y77Ip5Tll_Q0i3tjhLfByMI5WLTXOAkzb2GOvmpYU7vi59ojAbr3IZNSr-GpLWb8L1V1Ah-D4kP87HBqXvvJ9lahBYaxN'
const TIMEOUT = 5000

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

  constructor(attempts) {
    this.connected = false
    this.attempts = attempts || 5
  }

  async connect() {

    if (this.connected) return true

    window.location.assign(`paggcertoconnector:${URL_SANDBOX}`)

    for (var i = 0; i < this.attempts; i++) {

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

      if (response === null) return null

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

  close() {
    if (this.websocket === null) return

    this.websocket.close()
    this.websocket = null
  }

  _isXPos(device) {
    return device !== null &&
      device.manufacturer !== null &&
      device.manufacturer.toUpperCase().match(/PAX|GERTEC/) !== null;
  }
}

export default PinpadService
