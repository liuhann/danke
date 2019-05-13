export default class RestDAO {
  constructor (ctx, path) {
    this.ctx = ctx
    this.path = path
  }

  async list (filter, page, count) {
    const result = await this.ctx.get(`${this.path}/list`, {
      searchParams: Object.assign(filter, { page, count })
    }).json()
    return result
  }

  async regex (prop, value) {
    const result = await this.ctx.get(`${this.path}/regex/${prop}/${value}`, {}).json()
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
