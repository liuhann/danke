class UserDAO {
  constructor (ctx) {
    this.ctx = ctx
  }
  getCurrentUser () {
    return this.ctx.get(`user/current`).json()
  }

  register (username, password, nickname) {
    return this.ctx.post(`user/register`, {
      json: {
        name: username,
        password: password,
        nickname
      }
    }).json()
  }
  login (name, password, captcha) {
    return this.ctx.post(`user/login`, {
      json: {
        name,
        password,
        captcha
      }
    }).json()
  }
  async getCaptcha () {
    return this.ctx.get(`captcha`).json()
  }

  async sendSmsCode (phone) {
    return this.ctx.get(`user/sms/${phone}`).json()
  }

  logout () {
  }
}
export default UserDAO
