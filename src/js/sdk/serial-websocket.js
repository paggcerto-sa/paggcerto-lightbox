
export class SerialWebSocket {
  constructor(address) {
    this.address = address
    this.msgs = []
    this.queue = []
    this.waitPromise = null
    this.websocket = null
    this.connected = false
    this.connectionPromise = null
  }

  connect() {
    if (this.connectionPromise == null) {
        this.connectionPromise = new Promise(resolve => {
          this.websocket = new WebSocket(this.address)
          this.websocket.addEventListener('open', () => this._onOpen(resolve))
          this.websocket.addEventListener('message', msg => this._receiveMessage(msg))
          this.websocket.addEventListener('error' , () => this._onClose(resolve))
          this.websocket.addEventListener('close' , () => this._onClose(resolve))
      })
    }

    return this.connectionPromise
  }

  _onClose(resolveCallback) {
    resolveCallback(false)
    this.close()
  }

  _onError(resolveCallback) {
    resolveCallback(false)
    this.close()
  }

  _onOpen(resolveCallback) {
    this.connected = true
    resolveCallback(true)
  }

  _receiveMessage(msg) {
    if (this.queue.length === 0) {
      this.msgs.push(msg)
      return
    }

    this.queue[0].resolve(msg)
    this.queue.splice(0, 1)
  }

  async sendAndWait(msg) {
    if(!this.send(msg)) {
      return null
    }

    return await this.read()
  }

  send(msg) {
    if (!this.connected) return false

    this.websocket.send(msg)
    console.log('sending', msg)

    return true
  }

  read() {
    if (this.msgs.length > 0) {
      const tmp = this.msgs.splice(0, 1)
      console.log('readmsg', tmp)
      const msg = tmp[0]
      return Promise.resolve(msg)
    }

    return new Promise((resolve, reject) => {
      this.queue.push({resolve, reject})
    });
  }

  close() {
    this.connected = false
    this._cleanup()

    if (this.websocket != null) {
      this.websocket.close()
    }

    this.websocket = null
  }

  _cleanup() {
    if (this.queue === null) return

    for(var callback of this.queue) {
        callback.resolve(null)
    }

    this.queue = null
  }
}

export default SerialWebSocket
