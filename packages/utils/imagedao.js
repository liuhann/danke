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
    const result = await this.ctx.post(`mp3/upload?path=${path}&start=${start}&end=${end}`, formData)
    return result.data
  }

  /**
   * 删除个人空间的文件
   * @param path
   * @return {Promise<void>}
   */
  async removeBlob (path) {
    const response = await this.ctx.post(`image/remove`, {
      fileId: path
    })
    return response.data
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
    const response = await this.ctx.post(`image/upload?path=${path}`, formData)
    return response.data
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
