<template>
  <div class="user-form">
    <div class="auth-sidebar">
    </div>
    <section class="content">
      <nav class="auth-nav">
        <p class="auth-home">
          回到 <a href="/">首页</a>
        </p>
        <p class="auth-link">
          没有账号?  <a href="/register">马上注册</a>
        </p>
      </nav>
      <main>
        <div class="auth-content">
          <h2>登录</h2>
          <hr class="divider">
          <div class="auth-form sign-in-form">
            <form accept-charset="UTF-8" method="post" action="/" @submit.prevent="login">
              <input name="utf8" type="hidden" value="✓">
              <div class="form-fields">
                <fieldset>
                  <label for="login">用户名 （手机号码）</label>
                  <input id="login" v-model="username" type="text" name="login" class="text-input" autocorrect="off" autocapitalize="off">
                </fieldset>
                <fieldset>
                  <label class="password">密码 <a href="/password_resets/new">忘记密码?</a></label>
                  <input v-model="password" type="password" name="password" class="text-input">
                  <span v-if="error.username" class="error">{{ error.username }}</span>
                </fieldset>
                <fieldset>
                  <label>验证码<span @click="refreshCaptcha" v-html="svg"></span></label>
                  <input v-model="captcha" type="text" class="text-input">
                  <span v-if="error.captcha" class="error">{{ error.captcha }}</span>
                </fieldset>
              </div>
              <input class="button form-sub" type="submit" value="登录" tabindex="3">
            </form>
          </div>
        </div>
      </main>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Login',
  components: {  },
  mixins: [ ],
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
      return false
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
    bottom: 20px;
    right: 10px;
    color: #fff;
  }
  .scene {
    position: relative;
    overflow: hidden;
  }
  .element {
    position: absolute;
  }
}
.login-panel {
  width: 360px;
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
