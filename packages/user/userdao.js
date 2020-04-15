class UserDAO {
  constructor (ctx) {
    this.ctx = ctx
  }
  getCurrentUser () {
    return this.ctx.get(`user/current`).json()
  }

  register (username, password, nickname, captcha) {
    return this.ctx.post(`user/register`, {
      json: {
        name: username,
        password: password,
        nickname,
        captcha
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

  async logout() {
    return this.ctx.post(`user/logout`).json()
  }

  async getCaptcha () {
    return this.ctx.get(`captcha`).json()
  }

  async setAvatar (url) {
    return this.ctx.post(`user/avatar`, {
      json: {
        url
      }
    }).json()
  }

  async setUserProfile ({email, location, nick}) {
    return this.ctx.post(`user/update`, {
      json: {
        nick,
        email,
        location
      }
    }).json()
  }

  async sendSmsCode (phone) {
    return this.ctx.get(`user/sms/${phone}`).json()
  }
}
export default UserDAO
