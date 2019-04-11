<template>
<div class="login">
  <nav-bar></nav-bar>

  <div class="field">
    <label class="label">用户名</label>
    <div class="control">
      <input class="input" type="text" placeholder="输入手机号码">
    </div>
    <p class="help is-success">This username is available</p>
  </div>

  <div class="field">
    <label class="label">Email</label>
    <div class="control has-icons-left has-icons-right">
      <input class="input is-danger" type="email" placeholder="Email input" value="hello@">
      <span class="icon is-small is-left">
      <i class="fas fa-envelope"></i>
    </span>
      <span class="icon is-small is-right">
      <i class="fas fa-exclamation-triangle"></i>
    </span>
    </div>
    <p class="help is-danger">This email is invalid</p>
  </div>

  <div class="field">
    <label class="label">Subject</label>
    <div class="control">
      <div class="select">
        <select>
          <option>Select dropdown</option>
          <option>With options</option>
        </select>
      </div>
    </div>
  </div>

  <div class="field">
    <label class="label">Message</label>
    <div class="control">
      <textarea class="textarea" placeholder="Textarea"></textarea>
    </div>
  </div>

  <div class="field">
    <div class="control">
      <label class="checkbox">
        <input type="checkbox">
        I agree to the <a href="#">terms and conditions</a>
      </label>
    </div>
  </div>

  <div class="field">
    <div class="control">
      <label class="radio">
        <input type="radio" name="question">
        Yes
      </label>
      <label class="radio">
        <input type="radio" name="question">
        No
      </label>
    </div>
  </div>

  <div class="field is-grouped">
    <div class="control">
      <button class="button is-link">Submit</button>
    </div>
    <div class="control">
      <button class="button is-text">Cancel</button>
    </div>
  </div>
</div>
</template>

<script>

import NavBar from '../common/NavBar'
export default {
  name: 'Home',
  components: { NavBar },
  data () {
    return {
      username: '',
      password: '',
    }
  },

  created () {
    setInterval(() => {
      if (this.countDown !== 0) {
        this.countDown --
        // window.localStorage.setItem('sms.countdown', this.countDown)
      }
    }, 1000)
  },

  methods: {
    sendSmsCode () {
      if (this.countDown === 0 && this.isPoneAvailable(this.phone)) {
        this.ctx.userdao.sendSmsCode(this.phone)
        this.countDown = 90
      } else {
        this.ctx.vant.Dialog.alert({
          message: '错误的手机号码'
        })
      }
    },

    isPoneAvailable(phone) {
      if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(phone)) {
        return false
      } else {
        return true
      }
    },

    async login () {
      let result = await this.ctx.userdao.loginWithSms(this.phone, this.sms)
      if (result.ok === '1') {
        this.$router.replace('/')
      }
    }

  }
}
</script>

<style lang="less">
.login {
  font-size: 20px;
}
</style>
