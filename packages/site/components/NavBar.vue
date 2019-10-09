<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img src="//cdn.danke.fun/res/logo-light.png" >
        </a>
        <a
          role="button"
          class="navbar-burger burger"
          :class="burgerOpen"
          @click="toggleOpen"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu" :class="burgerOpen">
        <div class="navbar-start">
          <router-link to="/" class="navbar-item">首页</router-link>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              工具
            </a>
            <div class="navbar-dropdown">
              <router-link class="navbar-item" to="/frames">动画</router-link>
              <router-link class="navbar-item" to="/slide/lite/list">卡点</router-link>
              <router-link class="navbar-item" to="/scenes">页面</router-link>
              <router-link class="navbar-item" to="/works">展示</router-link>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item" v-if="!avatar">
            <div class="buttons">
              <router-link class="button is-primary" to="/register"><strong>注册</strong></router-link>
              <router-link class="button is-light" to="/login">登录</router-link>
            </div>
          </div>
          <div v-if="avatar" class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link is-arrowless">
              <figure class="image is-32x32" @click="goUserHome">
                <img :src="avatar" style="max-height: 48px!important;" width="48" height="48">
              </figure>
            </a>
            <div class="navbar-dropdown is-right">
              <router-link class="navbar-item" to="/user">
                个人信息
              </router-link>
              <a class="navbar-item">
                我的页面
              </a>
              <a class="navbar-item">
                我的展示
              </a>
              <hr class="navbar-divider">
              <a class="navbar-item" @click="logout">
                退出
              </a>
            </div>
          </div>
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
      //location.href = 'https://github.com/login/oauth/authorize?scope=user:email&client_id=9b1eec30dbf5235a78b3'
      this.$router.push('/user')
    },
    goUserHome () {
      this.$router.push('/user')
    }
  }
}
</script>

<style lang="scss">
</style>
