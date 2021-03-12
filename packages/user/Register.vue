<template>
  <div id="user-register">
    <nav-bar />
    <section class="section">
      <div class="columns is-mobile is-centered">
        <div class="column is-one-quarter-desktop is-full-mobile is-full-touch">
          <nav class="panel is-success">
            <p class="panel-heading">
              用户注册
            </p>
            <form style="margin: .75rem; padding-bottom: 2rem;" onsubmit="return false;">
              <div class="field">
                <label class="label">用户名（手机号码）</label>
                <p class="control is-expanded">
                  <input v-model="username" class="input is-fullwidth" type="text" :class="error.username?'is-danger': ''" placeholder="用户名（手机号码）">
                </p>
                <p v-show="error.username" class="help is-danger">{{ error.username }}</p>
              </div>
              <div class="field">
                <label class="label">密码 </label>
                <div class="control">
                  <input v-model="password" type="password" class="input" :class="error.password?'is-danger': ''" placeholder="请输入密码">
                </div>
                <p v-show="error.password" class="help is-danger">{{ error.password }}</p>
              </div>
              <div class="field">
                <label class="label">校验码</label>
                <span class="captcha" @click="refreshCaptcha" v-html="svg"></span>
                <div class="control">
                  <input v-model="captcha" type="text" class="input" :class="error.captcha?'is-danger': ''" placeholder="输入上面的验证码">
                </div>
                <p v-show="error.captcha" class="help is-danger">{{ error.captcha }}</p>
              </div>
              <div class="field">
                <label class="checkbox">
                  <input v-model="checked" type="checkbox">
                  我已阅读并同意 <a href="#">使用条款</a>
                </label>
              </div>

              <div class="field is-grouped">
                <div class="control">
                  <button class="button is-success is-fullwidth" :disabled="!checked" :class="isLoading?'is-loading': ''" @click="doRegister">创建新的账号</button>
                </div>
              </div>
            </form>
          </nav>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import NavBar from '../site/components/NavBar.vue'
export default {
  name: 'Register',
  components: {
    NavBar
  },
  data () {
    return {
      username: '',
      isLoading: false,
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

  computed: {
    workBackground () {
      if (this.showWork) {
        return this.showWork.color
      } else {
        return ''
      }
    },
    showWork () {
      if (this.works.length) {
        return this.works[0]
      } else {
        return null
      }
    }
  },

  created () {

  },

  mounted () {
    this.refreshCaptcha()
    this.initViewPort()
    this.loadWorks()
  },

  methods: {
    initViewPort () {
      const siderRect = document.querySelector('.auth-sidebar').getBoundingClientRect()
      this.workViewPort = {
        width: siderRect.width,
        height: siderRect.height
      }
    },
    viewport () {
      return this.workViewPort
    },
    listQuery () {
      return {
        'count': 1,
        'system.site': 'on',
      }
    },
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
        return false
      }
      if (this.password === '') {
        this.error.password = '请输入密码'
        return false
      }
      if (this.captcha === '') {
        this.error.captcha = '请输入验证码'
        return false
      }

      this.isLoading = true
      const result = await this.ctx.userdao.register(this.username, this.password, this.nickname, this.captcha)
      this.isLoading = false
      this.refreshCaptcha()
      if (result.code === 400) {
        this.error.username = '手机号码格式不正确'
        return false
      }
      if (result.code === 403) {
        this.error.captcha = '输入的验证码不正确'
        return false
      }
      if (result.code === 409) {
        this.error.username = '手机号码已经注册过'
        return false
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

.auth-sidebar {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(27, 63, 60, 1);
  position: relative;
  .by {
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: #fff;
    padding: 8px;
    background: rgba(0,0,0, .5);
  }
  .scene {
    position: relative;
    overflow: hidden;
  }
  .element {
    position: absolute;
  }
}
</style>
