class UserDAO {
  constructor (ctx) {
    this.ctx = ctx
  }

  getCurrentUser () {
    return this.ctx.get(`user/current`).json()
  }

  loginWithSms (phone, smsCode) {
    return this.ctx.post(`user/login`, {
      json: {
        phone,
        smsCode
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
