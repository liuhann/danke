export default class RestDAO {
  constructor (ctx, path) {
    this.ctx = ctx
    this.path = path
  }

  serialize (obj) {
    var str = []
    for (var p in obj) {
      if (obj.hasOwnProperty(p) && obj[p]) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
    }
    return str.join('&')
  }
  async getOne (id) {
    const result = await this.ctx.get(`${this.path}/${id}`)
    return result.data
  }
  async list (filter) {
    const result = await this.ctx.get(`${this.path}?${this.serialize(filter)}`)
    return result.data
  }
  async multiGet (ids) {
    const result = await this.ctx.post(`${this.path}/id`, {
      ids
    })
    return result.data
  }

  /**
  * 创建或者更新对象
  */
  async createOrPatch (o) {
    if (o._id) {
      return this.patch(o._id, o)
    } else {
      delete o._id
      return this.create(o)
    }
  }

  async create (o) {
    return (await this.ctx.post(`${this.path}`, {
      json: o
    })).json()
  }

  async regex (prop, value, limit) {
    const result = await this.ctx.get(`${this.path}/regex/${prop}/${value}?limit=${limit || 1000}`, {}).json()
    return result
  }

  async patch (id, json) {
    const result = await this.ctx.patch(`${this.path}/${id}`, json)
    return result.data
  }

  async delete (o) {
    const result = await this.ctx.delete(`${this.path}/${o._id}`).json()
    return result
  }
  async distinct (field, json) {
    const result = await this.ctx.post(`${this.path}/distinct/${field}`, {
      json
    }).json()
    return result
  }
}
