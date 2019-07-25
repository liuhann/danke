export default class ImageDAO {
  constructor (ctx) {
    this.ctx = ctx
  }

  async uploadBlob (blob, path) {
    // check file size
    const formData = new window.FormData()
    if (!blob.lastModifiedDate) {
      blob.lastModifiedDate = new Date()
    }
    formData.append('file', blob, blob.filename)
    return this.ctx.post(`image/upload?path=${path}`, {
      body: formData
    }).json()
  }

  async uploadImage (file) {
    // check file size
    const formData = new window.FormData()
    formData.append('file', file)
    // formData.append('file', file)
    return this.ctx.post(`image/upload`, {
      body: formData
    }).json()
  }
}
