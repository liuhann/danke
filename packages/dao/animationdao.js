export default class AnimationDAO {
  constructor (ctx) {
    this.ctx = ctx
  }

  async addAnimation (animation) {
    return this.ctx.put('animation', {
      json: animation
    }).json()
  }

  async getAnimationList (skip, limit) {
    return this.ctx.get(`animation/list?skip=${skip}&limit=${limit}`).json()
  }
}
