import { ResolvablePromise } from "../util/async";

export class SerialWebSocket {
  constructor(address) {
    this._address = address
    this._msgs = []
    this._queue = []
    this._waitPromise = null
    this._websocket = null
    this._connected = false
    this._connectionPromise = null
    this._closePromise = null
  }

  connect() {
    if (this._connectionPromise == null) {
        this._connectionPromise = new ResolvablePromise()
        this._closePromise = new ResolvablePromise()
        this._websocket = new WebSocket(this._address)
        this._websocket.addEventListener('open', () => this._onOpen())
        this._websocket.addEventListener('message', msg => this._receiveMessage(msg))
        this._websocket.addEventListener('close' , () => this._onClose())
    }

    return this._connectionPromise.promise
  }

  _onClose() {
    this._cleanup()
    this._connected = false
    this._websocket = null
    this._connectionPromise.resolve(false)
    this._closePromise.resolve()
  }

  _onOpen() {
    this._connected = true
    this._connectionPromise.resolve(true)
  }

  _receiveMessage(msg) {
    if (this._queue.length === 0) {
      this._msgs.push(msg)
      return
    }

    this._queue[0].resolve(msg)
    this._queue.splice(0, 1)
  }

  async sendAndWait(msg) {
    if(!this.send(msg)) {
      return null
    }

    return await this.read()
  }

  send(msg) {
    if (!this._connected) return false

    this._websocket.send(msg)

    return true
  }

  read() {
    if (this._msgs.length > 0) {
      const tmp = this._msgs.splice(0, 1)
      const msg = tmp[0]
      return Promise.resolve(msg)
    }

    return new Promise((resolve, reject) => {
      this._queue.push({resolve, reject})
    });
  }

  async close() {

    if (this._websocket !== null) {
      this._websocket.close()
    }

    await this._closePromise
  }

  _cleanup() {
    if (this._queue === null) return

    for(var callback of this._queue) {
        callback.resolve(null)
    }

    this._queue = null
  }
}

export default SerialWebSocket
