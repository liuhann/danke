export default class AnimationDAO {
  constructor (ctx) {
    this.ctx = ctx
  }

  async addAnimation (animation) {
    return this.ctx.put('animation',  {
      json: animation
    }).json()
  }

  async getAnimationList (type, skip, limit) {
    return this.ctx.get(`animation/list`, {
      searchParams: {
        type,
        skip,
        limit
      }
    }).json()
  }

  async removeAnimation (_id) {
    return this.ctx.delete(`animation?_id=${_id}`, {
      searchParams: {
        _id
      }
    }).json()
  }
}
