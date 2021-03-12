<template>
  <div id="user-login">
    <nav-bar />
    <section class="section">
      <div class="columns is-mobile is-centered">
        <div class="column is-one-quarter-desktop is-full-mobile is-full-touch">
          <nav class="panel is-info">
            <p class="panel-heading">
              用户登录
            </p>
            <form style="margin: .75rem; padding-bottom: 2rem;" onsubmit="return false;">
              <div class="field">
                <label class="label">用户名（手机号码）</label>
                <p class="control is-expanded">
                  <input v-model="username" class="input is-fullwidth" type="text" placeholder="用户名（手机号码）">
                </p>
              </div>
              <div class="field">
                <label class="label">密码 </label>
                <div class="control">
                  <input v-model="password" type="password" class="input" :class="error.msg?'is-danger': ''" placeholder="请输入密码">
                </div>
                <p v-show="error.msg" class="help is-danger">用户名或者密码不正确</p>
              </div>
            
              <div class="field">
                <label class="label">校验码</label>
                <span class="captcha" @click="refreshCaptcha" v-html="svg"></span>
                <div class="control">
                  <input v-model="captcha" type="text" class="input" :class="error.captcha?'is-danger': ''" placeholder="输入上面的验证码">
                </div>
                <p v-show="error.captcha" class="help is-danger">验证码不正确</p>
              </div>

              <div class="field is-grouped">
                <div class="control">
                  <button class="button is-link is-fullwidth" :class="isLoading?'is-loading': ''" @click="login">登录</button>
                </div>
                <div class="control">
                  <button class="button is-link is-light">忘记密码</button>
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
  name: 'Login',
  components: { NavBar },
  mixins: [ ],
  data () {
    return {
      error: {
        captcha: '',
        msg: ''
      },
      captcha: '',
      svg: '',
      username: '',
      password: '',
      isLoading: false,
      workViewPort: {
        width: 200,
        height: 200
      }
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
      if (result.code === '100400') {
        this.error.captcha = '验证码不正确'
        this.refreshCaptcha()
        this.isLoading = false
      }
      if (result.code === '401') {
        this.error.captcha = ''
        this.error.msg = result.msg
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
      return false
    }

  }
}
</script>

<style lang="scss">
.captcha {
  svg {
    width: 120px;
  }
}
</style>
