<template>
<div class="user-form">
  <section class="auth-sidebar">
    <div class="auth-sidebar-content">
      <header>
        <a href="/" class="logo">
        </a>
        <h1>Discover the world’s top Designers &amp; Creatives.</h1>
      </header>
      <div class="artwork">
        <div class="artwork-image"></div>
        <p class="artwork-attribution">
          Art by
          <a class="url" rel="contact" href="/karicca">Irina Valeeva</a>
        </p>
      </div>
    </div>
  </section>
  <section class="content">
    <nav class="auth-nav">
      <p class="auth-link">
        已有账号?  <a href="/login">去登录</a>
      </p>
    </nav>
    <main>
      <div class="auth-content">
        <h2>注册</h2>
        <hr class="divider">
        <div class="auth-form sign-in-form">
          <form accept-charset="UTF-8" method="post" action="/" @submit.prevent="doRegister"><input name="utf8" type="hidden" value="✓">
            <div class="form-fields">
              <fieldset>
                <label for="username">用户名 （手机号码）</label>
                <input class="text-input" id="username" :class="error.username? 'is-danger': ''" v-model="username" type="text" placeholder="输入手机号码">
                <span class="error" v-if="error.username">{{error.username}}</span>
              </fieldset>
              <fieldset>
                <label class="password">密码</label>
                <input class="text-input" :class="error.password? 'is-danger': ''" v-model="password" type="password" placeholder="输入密码">
                <span class="error" v-if="error.password">密码不能为空</span>
              </fieldset>
              <fieldset>
                <label>验证码<span @click="refreshCaptcha" v-html="svg"></span></label>
                <input type="text" v-model="captcha" :class="error.captcha? 'is-danger': ''" class="text-input small">
                <span class="error" v-if="error.captcha">{{error.captcha}}</span>
              </fieldset>
              <fieldset>
                <input type="checkbox" v-model="checked"><span>同意<a href="#">使用条款</a></span>
              </fieldset>
              <fieldset>
                <input class="button form-sub" :disabled="!checked" type="submit" value="创建新的账号" tabindex="3">
              </fieldset>
            </div>
          </form>
        </div>
      </div>
    </main>
  </section>
</div>
</template>

<script>

export default {
  name: 'Register',
  data () {
    return {
      username: '',
      checked: true,
      error: {
        username: '',
        password: '',
        captcha: ''
      },
      svg: '',
      captcha: '',
      password: ''
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
    async doRegister () {
      this.error.username = ''
      this.error.password = ''
      this.error.captcha = ''
      if (this.username === '') {
        this.error.username = '请输入用户名'
        return
      }
      if (this.password === '') {
        this.error.password = '请输入密码'
        return
      }
      if (this.captcha === '') {
        this.error.captcha = '请输入验证码'
        return
      }

      const result = await this.ctx.userdao.register(this.username, this.password, this.nickname, this.captcha)
      if (result.code === 400) {
        this.error.username = '手机号码格式不正确'
        return
      }
      if (result.code === 403) {
        this.error.captcha = '输入的验证码不正确'
        return
      }
      if (result.code === 409) {
        this.error.username = '手机号码已经注册过'
        return
      }
      if (result.token) {
        localStorage.setItem('token', result.token)
      }
      this.$router.replace('/')
    }
  }
}
</script>

<style lang="scss">
@import "user-form";
</style>
