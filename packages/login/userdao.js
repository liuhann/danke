class UserDAO {
  constructor (ctx) {
    this.ctx = ctx
  }
  getCurrentUser () {
    return this.ctx.get(`user/current`).json()
  }

  register (username, password) {
    return this.ctx.post(`user/register`, {
      json: {
        name: username,
        password: password
      }
    }).json()
  }

  login (username, password) {
    return this.ctx.post(`user/login`, {
      json: {
        name: username,
        password: password
      }
    }).json()
  }

  async sendSmsCode (phone) {
    return this.ctx.get(`user/sms/${phone}`).json()
  }

  logout () {
  }
}
export default UserDAO
