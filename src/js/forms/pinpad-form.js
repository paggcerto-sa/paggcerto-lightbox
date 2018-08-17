import Payment from '../sdk/payment'
import { TIMEOUT } from 'dns';

const VIEW = `
  <div>
    <h1> pinpad </h1>
  </div>
`

export class PinpadForm {

  constructor($container, options, credit) {
    this.$container = $container
    this.options = options
    this.payment = new Payment(options)
    this.credit = credit
  }

  async render() {

    this.$container.html(VIEW)

    const pinpad = this.options.pinpad
    const devices = await pinpad.listDevices()

    if (devices === null || devices.length === 0) {
      return
    }

    const device = devices[0].port
    const cardInformation = await pinpad.readCard(this.options.payment.amount, device, this.credit)

    if (cardInformation === null) return

    const sellingkey = this.options.sellingkey
    const installments = this.options.payment.installments || 1
    const token = this.options.token

    const paymentResponse = await pinpad.pay(sellingkey, installments, token, console.log);
    this.options.paymentResponse = paymentResponse

    pinpad.close()
  }
}

export default PinpadForm
