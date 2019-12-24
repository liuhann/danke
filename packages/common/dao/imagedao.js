export default class ImageDAO {
  constructor (ctx) {
    this.ctx = ctx
  }

  async uploadAndCutMp3 (blob, path, start, end) {
    // check file size
    const formData = new window.FormData()
    if (!blob.lastModifiedDate) {
      blob.lastModifiedDate = new Date()
    }
    formData.append('file', blob, blob.filename)
    return this.ctx.post(`mp3/upload?path=${path}&start=${start}&end=${end}`, {
      body: formData
    }).json()
  }

  /**
   * 删除个人空间的文件
   * @param path
   * @return {Promise<void>}
   */
  async removeBlob (path) {
    await this.ctx.post(`image/remove`, {
      json: {
        fileId: path
      }
    }).json()
  }

  /**
   * 上传一个文件到个人空间。
   * @param blob 文件内容
   * @param path 位于个人空间的目录位置
   * @return {Promise<*|JSONValue>}
   */
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
