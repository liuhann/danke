import ky from 'ky'
class WorkDAO {
  constructor (baseUrl) {
    this.baseUrl = baseUrl + '/api'
  }

  async addOrUpdateWork (work) {
    this.mignifyWork(work)
    const result = await ky.post(this.baseUrl + '/danke/v2/work', {
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
    return ky.get(`${this.baseUrl}/danke/v2/work/${id}`).json()
  }

  async listMine () {
    const result = await ky.get(this.baseUrl + '/danke/v2/works/mine').json()
    return result
  }
  async removeWork (id) {
    return ky.delete(`${this.baseUrl}/danke/v2/work/${id}`).json()
  }

  async uploadImage (file) {
    // check file size
    const formData = new FormData()
    formData.append('file', file)
    return ky.post(`${this.baseUrl}/danke/v2/image/upload`, {
      body: formData
    }).json()
  }
}
export default WorkDAO
