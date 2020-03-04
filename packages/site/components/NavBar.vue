<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img src="//cdn.danke.fun/res/logo-light.png" >
        </a>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <router-link to="/vector/list">渐变矢量</router-link>
        </div>
        <div class="navbar-item">
          <router-link to="/clippath/list">矢量裁切</router-link>
        </div>
        <div class="navbar-item" v-if="!avatar">
          <div class="buttons">
            <router-link class="button is-primary" to="/register"><strong>注册</strong></router-link>
            <router-link class="button is-light" to="/login">登录</router-link>
          </div>
        </div>
        <div v-if="avatar" class="navbar-item has-dropdown is-hoverable">
          <router-link class="button is-primary" to="/register"><strong>Danke</strong></router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { resetToken } from '../../user/token'

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
    avatar () {
      if (this.user && this.user.id) {
        return this.user.avatar || this.ctx.cdn + '/res/head.svg'
      } else {
        return null
      }
    }
  },

  mounted () {
    this.$router.beforeEach((to, from, next) => {
      this.isMobileOpened = false
      next()
    })
  },

  methods: {
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
nav.navbar {
  padding: 2rem 3rem;
  line-height: 2.5rem;
  align-items: stretch;
  justify-content: center;
  display: flex;
  .container {
    display: flex;
    font-size: 1.8rem;
    .navbar-end {
      display: flex;
      justify-content: flex-end;
      margin-right: auto;
      flex: 1;
      .navbar-item {
        font-weight: bold;
        margin: 0 20px;
        a {
          text-decoration: none;
        }
        a:hover {
          color: rgba(255,255,255, .8);
        }
      }
      a {
        color: #fff;
      }
    }
  }
  .navbar-item img {
    max-height: 2.5rem;
  }
}
</style>
