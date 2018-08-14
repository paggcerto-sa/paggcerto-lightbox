class Buffer {
  constructor(file) {
    this._file = file
  }

  toBlob(type) {
    type = type || 'application/octet-stream';

    let blob = null

    try {
      blob = new Blob([this._file], { type: type })
    } catch (e) {
      const blobBuilder = new (window.WebKitBlobBuilder || window.MozBlobBuilder)
      blobBuilder.append(this._file)
      blob = blobBuilder.getBlob(type)
    }

    return blob
  }

  saveToFile(type, filename) {
    const url = URL.createObjectURL(this.toBlob(type))
    const a = document.createElement('a')

    a.href = url
    a.download = filename
    a.click()
    a.remove()

    window.URL.revokeObjectURL(url)
  }
}

export default Buffer
