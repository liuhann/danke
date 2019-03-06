class WorkDAO {
  constructor (ctx) {
    this.ctx = ctx
  }

  async addOrUpdateWork (work) {
    this.mignifyWork(work)
    const result = await this.ctx.post('danke/v2/work', {
      json: work
    }).json()
    return result
  }
  mignifyWork (work) {
    const images = []
    for (let scene of work.scenes) {
      if (scene.background.image) {
        images.push(scene.background.image)
      }
      for (let element of scene.elements) {
        delete element.computedStyle
        if (element.background && element.background.image) {
          images.push(element.background.image)
        }
      }
    }
    work.images = images
  }

  async getWork (id) {
    return this.ctx.ky.get(`danke/v2/work/${id}`).json()
  }

  async listMine () {
    const result = await this.ctx.get('danke/v2/works/mine').json()
    return result
  }
  async removeWork (id) {
    return this.ctx.delete(`danke/v2/work/${id}`).json()
  }
  async saveTemplate (element) {
    await this.ctx.post(`danke/v2/template/element`).json()
  }
  async uploadImage (file) {
    // check file size
    const formData = new FormData()
    formData.append('file', file)
    return this.ctx.post(`danke/v2/image/upload`, {
      body: formData
    }).json()
  }
}
export default WorkDAO
