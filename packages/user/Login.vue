<template>
<div id="main-container">
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
          没有账号?  <a href="/signup/new">马上注册</a>
        </p>
      </nav>
      <main>
        <div class="auth-content">
          <h2>登录</h2>
          <div class="auth-connections">
            <a class="form-btn auth-google auth-google-new" rel="nofollow" data-method="post" href="/auth/google">
              <svg xmlns="http://www.w3.org/2000/svg" aria-labelledby="d006l1l26wmptmtqj601dzpgsp5ajtr" role="img" viewBox="0 0 24 24" class="icon "><title id="d006l1l26wmptmtqj601dzpgsp5ajtr">Google icon</title><path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"></path></svg>
              Sign in with Google
            </a>
            <a class="auth-twitter form-btn" rel="nofollow" data-method="post" href="https://dribbble.com/auth/Twitter?return_to=%2Fshots%2Fpopular%2Fanimation">
              <svg xmlns="http://www.w3.org/2000/svg" aria-labelledby="k7gyuzk8fjoegpuda4i89bsbll20tka" role="img" viewBox="0 0 24 24" class="icon "><title id="k7gyuzk8fjoegpuda4i89bsbll20tka">Twitter icon</title><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"></path></svg>

            </a>
            <a class="form-btn auth-facebook " rel="nofollow" title="Sign in with Facebook" data-method="post" href="/auth/facebook/callback">
              <svg xmlns="http://www.w3.org/2000/svg" aria-labelledby="psswu8xx120bhnkgjh1imb5v15aq7tx" role="img" viewBox="0 0 24 24" class="icon "><title id="psswu8xx120bhnkgjh1imb5v15aq7tx">Facebook icon</title><path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.408.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.097 2.796.141v3.24h-1.921c-1.5 0-1.792.721-1.792 1.771v2.311h3.584l-.465 3.63H16.56V24h6.115c.733 0 1.325-.592 1.325-1.324V1.324C24 .593 23.408 0 22.676 0"></path></svg>
            </a>
          </div>

          <hr class="divider">

          <div class="auth-form sign-in-form">
            <form accept-charset="UTF-8" method="post" action="/" @submit.prevent="login"><input name="utf8" type="hidden" value="✓">
              <div class="form-fields">
                <fieldset>
                  <label for="login">用户名 （手机号码）</label>
                  <input type="text" name="login" id="login" v-model="username" class="text-input" autocorrect="off" autocapitalize="off">
                </fieldset>
                <fieldset>
                  <label class="password">密码 <a href="/password_resets/new">忘记密码?</a></label>
                  <input type="password" name="password" v-model="password" class="text-input">
                </fieldset>
                <fieldset>
                  <label>验证码<span @click="refreshCaptcha" v-html="svg"></span></label>
                  <input type="text" v-model="captcha" class="text-input">
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
  name: 'Home',
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
      debugger
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
      return false
    }

  }
}
</script>

<style lang="scss">
@media (min-width: 768px) {
  #main-container {
    height: 100%;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: row;
    flex-direction: row;
    overflow: hidden;
    .auth-sidebar {
      width: 514px;
    }
    main {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
      margin: 0;
      padding: 0;
    }
    .auth-content {
      padding: 30px 60px 0;
      margin: 0;
    }
  }
}

#main-container {
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    .auth-content {
      width: 100%;
      max-width: 416px;
      svg {
        fill: currentColor;
        height: 13px;
        width: 13px;
        vertical-align: middle;
        margin-top: -3px;
        margin-right: 2px;
        color: #6e6d7a;
      }
      .divider {
        overflow: visible;
        padding: 0;
        margin-bottom: 10px;
        border: none;
        border-top: 1px solid #e0e0e0;
        color: #6e6d7a;
        text-align: center;
      }
      form {
        fieldset {
          svg {
            margin-left: 20px;
            width: 100px;
            height: 40px;
          }
          label {
            display: block;
            font: bold 15px/24px "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
            margin: 14px 0 4px;
            color: #0d0c22;
          }
          input.text-input {
            width: 100%;
            margin-right: 8px;
            border: 1px solid transparent;
            font-family: 'Haas Grot Text R Web', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 16px;
            font-weight: 400;
            line-height: 24px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            height: 40px;
            padding: 10px 16px;
            outline: none;
            border-radius: 8px;
            transition: background-color 200ms ease, outline 200ms ease, color 200ms ease, box-shadow 200ms ease;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            color: #0d0c22;
            background-color: #f3f3f4;
          }
          margin: 0 0 12px;
        }
        .button.form-sub {
          color: #fff;
          display: inline-block;
          padding: 10px 16px;
          cursor: pointer;
          border: none;
          text-decoration: none;
          background: #ea4c89;
          -webkit-transition: all 200ms ease;
          transition: all 200ms ease;
          border-radius: 8px;
          appearance: none;
          position: relative;
          outline: none;
          font-family: 'Haas Grot Text R Web', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          height: 40px;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          text-align: center;
        }
      }
    }
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
