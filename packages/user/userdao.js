class UserDAO {
  constructor (ctx) {
    this.ctx = ctx
  }
  async getCurrentUser () {
    const response = await this.ctx.get(`user/current`)
    return response.data
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
  async login (name, password, captcha) {
    const response = await this.ctx.post(`user/login`, {
      name,
      password,
      captcha
    })
    return response.data
  }

  async logout() {
    return this.ctx.post(`user/logout`).json()
  }

  async getCaptcha () {
    const response = await this.ctx.get(`captcha`)
    return response.data
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
