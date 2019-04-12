<template>
<div class="login">
  <nav-bar></nav-bar>

  <section class="login-panel box">
    <h1 class="title">登录</h1>
    <div class="field">
      <label class="label">用户名</label>
      <div class="control">
        <input class="input is-danger" v-model="username" type="text" placeholder="输入手机号码">
      </div>
      <p class="help is-danger">This username is available</p>
    </div>

    <div class="field">
      <label class="label">密码</label>
      <div class="control">
        <input class="input is-danger" v-model="password" type="password" placeholder="输入密码">
      </div>
      <p class="help is-danger">This username is available</p>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button class="button is-primary">登录</button>
      </div>
      <div class="control">
        <button class="button is-text" @click="register">注册</button>
      </div>
    </div>
  </section>

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
    register () {
      this.$router.push('/register')
    },
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
.login-panel {
  width: 320px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 10px;
}
</style>
