<template>
  <div class="login">
    <nav-bar></nav-bar>

    <section class="login-panel box">
      <h1 class="title">注册</h1>
      <div class="field">
        <label class="label">手机号</label>
        <div class="control">
          <input class="input" :class="error.username? 'is-danger': ''" v-model="username" type="text" placeholder="输入手机号码">
        </div>
        <p v-if="error.username" class="help is-danger">{{error.username}}</p>
      </div>

      <div class="field">
        <label class="label">用户名 <span class="is-small">(可选)</span></label>
        <div class="control">
          <input class="input" v-model="nickname" type="text">
        </div>
      </div>

      <div class="field">
        <label class="label">密码</label>
        <div class="control">
          <input class="input" :class="error.password? 'is-danger': ''" v-model="password" type="password" placeholder="输入密码">
        </div>
        <p v-if="error.password" class="help is-danger">{{error.password}}</p>
      </div>

      <div class="field">
        <div class="control">
          <label class="checkbox">
            <input type="checkbox" v-model="checked">
            同意<a href="#">danke.fun 使用条款</a>
          </label>
        </div>
      </div>
      <div class="field is-grouped">
        <div class="control">
          <button class="button is-success" :disabled="!checked" @click="doRegister">注册</button>
        </div>
        <div class="control">
          <button class="button is-text">忘记密码</button>
        </div>
      </div>
    </section>

  </div>
</template>

<script>

import NavBar from '../site/components/NavBar'
export default {
  name: 'Register',
  components: { NavBar },
  data () {
    return {
      username: '',
      checked: true,
      error: {
        nickname: '',
        username: '',
        password: ''
      },
      password: ''
    }
  },

  created () {
  },

  methods: {
    async doRegister () {
      if (this.username === '') {
        this.error.username = '请输入用户名'
        return
      }
      if (this.password === '') {
        this.error.password = '请输入密码'
        return
      }

      const result = await this.ctx.userdao.register(this.username, this.password, this.nickname)
      if (result.code === 400) {
        this.error.username = '手机号码格式不正确'
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
.login-panel {
  width: 320px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 10px;
}
</style>
