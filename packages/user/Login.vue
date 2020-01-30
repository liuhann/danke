<template>
<div class="login">
  <nav-bar></nav-bar>
  <section class="login-panel box">
    <h1 class="title">登录</h1>
    <div class="field">
      <label class="label">用户名</label>
      <div class="control">
        <input class="input" v-model="username" type="text" placeholder="输入用户名">
      </div>
      <p v-if="error.username" class="help is-danger">用户名或密码不正确</p>
    </div>

    <div class="field">
      <label class="label">密码</label>
      <div class="control">
        <input class="input" v-model="password" type="password" placeholder="输入密码">
      </div>
    </div>

    <div class="field">
      <label class="label">验证码</label>
      <div class="control">
        <input class="input captcha" v-model="captcha">
        <span @click="refreshCaptcha" v-html="svg"></span>
      </div>
      <div class="control">
      </div>
      <p v-if="error.captcha" class="help is-danger">{{error.captcha}}</p>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button class="button is-primary" :class="isLoading? 'is-loading': ''" @click="login">登录</button>
      </div>
      <div class="control">
        <button class="button is-text" @click="register">注册</button>
      </div>
    </div>
  </section>

</div>
</template>

<script>
import NavBar from '../site/components/NavBar'
export default {
  name: 'Home',
  components: { NavBar },
  data () {
    return {
      error: {
        captcha: '',
        username: ''
      },
      captcha: '',
      svg: '',
      username: '',
      password: '',
      isLoading: false
    }
  },

  created () {

  },

  mounted () {
    this.refreshCaptcha()
  },

  methods: {
    async refreshCaptcha () {
      const result = await this.ctx.userdao.getCaptcha()
      this.svg = result.svg
    },

    register () {
      this.$router.push('/register')
    },

    async login () {
      this.isLoading = true
      let result = await this.ctx.userdao.login(this.username, this.password, this.captcha)
      if (result.code === 400) {
        this.error.captcha = '验证码不正确'
        this.refreshCaptcha()
        this.isLoading = false
      }
      if (result.code === 401) {
        this.error.captcha = ''
        this.error.username = result.message
        this.captcha = ''
        this.refreshCaptcha()
        this.isLoading = false
      }
      if (result.code === 200) {
        this.ctx.user = result.user
        if (this.ctx.toPath) {
          this.$router.replace(this.ctx.toPath)
          this.ctx.toPath = null
        } else {
          this.$router.replace('/')
        }
        this.isLoading = false
      }
    }

  }
}
</script>

<style lang="scss">
.login-panel {
  width: 320px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 10px;
  .captcha {
    width: 100px;
  }
  svg {
    height: 2.25rem;
  }
}
</style>
