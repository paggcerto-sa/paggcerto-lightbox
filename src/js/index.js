/*!
 * Paggcerto v1.0.0-alpha.1
 * Copyright 2018 Paggcerto
 */

import Lightbox from './lightbox'
import LightboxOptions from './lightbox-options'

const paggcerto = {
  lightbox(options) {
    options = new LightboxOptions(options).asObject()
    new Lightbox(options, {}).show()
  }
}

window.paggcerto = paggcerto

export {
  paggcerto
}
