export default class RestDAO {
  constructor (ctx, path) {
    this.ctx = ctx
    this.path = path
  }

  serialize (obj) {
    var str = []
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
    }
    return str.join('&')
  }

  async list (filter) {
    const result = await this.ctx.get(`${this.path}/list?${this.serialize(filter)}`).json()
    return result
  }

  async regex (prop, value, limit) {
    const result = await this.ctx.get(`${this.path}/regex/${prop}/${value}?limit=${limit || 1000}`, {}).json()
    return result
  }

  async patch (id, json) {
    await this.ctx.ky.patch(`${this.path}/${id}`, {
      json
    })
  }

  async delete (o) {
    const result = await this.ctx.delete(`${this.path}/${o._id}`).json()
    return result
  }
}
