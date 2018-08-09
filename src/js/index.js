import Lightbox from './lightbox'
import LightboxOptions from './lightbox-options'

const paggcerto = {
  lightbox(options) {
    options = new LightboxOptions(options).asObject()
    new Lightbox(options).show()
  }
}

export default paggcerto
