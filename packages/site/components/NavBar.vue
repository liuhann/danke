<template>
  <div id="header" class="nav-wrapper" role="navigation" aria-label="main navigation">
    <div class="container">
      <div id="logo" class="nav-logo">
        <a class="navbar-item" href="/">
           danke.fun
        </a>
      </div>
      <div class="navbar-end">
        <div class="navbar-item" v-if="!logon">
          <div class="buttons">
            <router-link class="button is-light" to="/login">登录</router-link>
            <router-link class="button form-sub" to="/register"><strong>注册</strong></router-link>
          </div>
        </div>
        <router-link v-if="logon" class="navbar-item" tag="div" to="/creative/my">
          <img class="avatar" :src="avatar">
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { resetToken } from '../../user/token'
import { getImageUrl } from '../../xd-builder/mixins/imageUtils'

export default {
  name: 'NavBar',
  props: {

  },
  data () {
    return {
      user: this.ctx.user,
      isMobileOpened: false
    }
  },
  created () {
    this.ctx.on && this.ctx.on('user-updated', (user) => {
      this.user = user
    })
  },
  computed: {
    burgerOpen () {
      return this.isMobileOpened ? 'is-active' : ''
    },
    logon () {
      return this.user.id
    },
    avatar () {
      if (this.user && this.user.avatar) {
        return this.getImageUrl(this.user.avatar, 96, 96)
      } else {
        return 'http://cdn.danke.fun/res/head.svg'
      }
    },
  },

  mounted () {
    this.$router.beforeEach((to, from, next) => {
      this.isMobileOpened = false
      next()
    })
  },

  methods: {
    getImageUrl,
    logout () {
      this.ctx.token = resetToken()
      this.ctx.user = null
      this.ctx.emit('user-updated', null)
      this.$router.push('/')
    },
    toggleOpen () {
      this.isMobileOpened = !this.isMobileOpened
    },
    getStarted () {
      // location.href = 'https://github.com/login/oauth/authorize?scope=user:email&client_id=9b1eec30dbf5235a78b3'
      this.$router.push('/user')
    },
    goUserHome () {
      this.$router.push('/user')
    }
  }
}
</script>

<style lang="scss">
@media (min-width: 768px) {
  .nav-wrapper {
    height: 64px;
    line-height: 64px;
    will-change: initial;
    .container {
      display: flex;
      padding: 0 30px;
    }
  }
}
.nav-wrapper {
  width: 100%;
  background: #fff;
  z-index: 9996;
  color: #6e6d7a;
  position: fixed;
  will-change: transform;
  top: 0;
  height: 64px;
  #logo {
    a {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 64px;
      color: #333;
      font-size: 20px;
      font-family: 'Audiowide', cursive;
    }
  }
  .container {
    margin: 0 auto;
    background-color: #fff;
    -webkit-box-shadow: inset 0px -1px 0px #f3f3f4;
    box-shadow: inset 0px -1px 0px #f3f3f4;
    display: flex;
    .navbar-end {
      display: flex;
      justify-content: flex-end;
      margin-right: auto;
      flex: 1;
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
        margin: 0 20px;
        &:hover {
          background: rgba(234, 76, 137, 0.85);
          color: #fff;
        }
        &:disabled {
          background: #ccc;
        }
      }
      .navbar-item {
        margin: 0 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .navbar-item img.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

.section.first {
  margin-top: 80px;
}
</style>
