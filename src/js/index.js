import Lightbox from './lightbox'
import LightboxOptions from './lightbox-options'

const paggcerto = {
  async lightbox(options) {
    options = new LightboxOptions(options).asObject()
    await new Lightbox(options).initialize()
  }
}

export default paggcerto
