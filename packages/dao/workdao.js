import ky from 'ky'
class WorkDAO {
  constructor (baseUrl) {
    this.baseUrl = baseUrl + '/api'
  }

  async addOrUpdateWork (work) {
    const result = await ky.post(this.baseUrl + '/danke/v2/work', {
      json: work
    }).json()
    return result
  }

  async getWork (id) {
    return ky.get(`${this.baseUrl}/danke/v2/work/${id}`).json()
  }

  async listMine () {
    const result = await ky.get(this.baseUrl + '/danke/v2/works/mine').json()
    return result
  }
}
export default WorkDAO
