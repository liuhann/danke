export default class ImageDAO {
  constructor (ctx, bucket) {
    this.ctx = ctx
    this.bucket = bucket || 'dankev3'
  }

  async getImageSize (blob) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = function () {
        resolve({
          width: this.width,
          height: this.height
        })
      }
    })
  }

  /**
   * 
   * @param {*} file 上传文件
   * @param {*} uploadFiles 已有文件列表
   * @param {*} filePath 上传的路径
   */
  async fileChoosed (file, uploadFiles, filePath) {
    console.log('file choosed', file, uploadFiles)
    const imageObject = {
      name: file.name,
      size: file.size,
    }
    
    let uploadPath = filePath || 'anomymous.file' 

    if (typeof uploadPath === 'function') {
      uploadPath = uploadPath(file)
    }

    let result = await this.uploadBlob(file.raw, uploadPath, true)
    imageObject.url = result.name
    const size = await this.getImageSize(file.raw)
    imageObject.w = size.width
    imageObject.h = size.height
    return imageObject
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
    const response = await this.ctx.post(`${this.bucket}/image/remove`, {
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
  async uploadBlob (blob, path, isPublic) {
    // check file size
    const formData = new window.FormData()
    if (!blob.lastModifiedDate) {
      blob.lastModifiedDate = new Date()
    }
    formData.append('file', blob, blob.filename)
    const response = await this.ctx.post(`${this.bucket}/image/upload?path=${path}${isPublic?'&public=true':''}`, formData)
    return response.data.data
  }


  // 同时删除图片及阿里云位置
  async removeImage (img) {

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
