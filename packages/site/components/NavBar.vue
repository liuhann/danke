<template>
  <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="http://www.danke.fun">
        <img :src="logo" />
      </a>
      <a class="navbar-item">DANKE.FUN</a>
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" @click="toggleMenuShow">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" :class="menuShow? 'is-active': ''">
      <div class="navbar-end">
        <a v-if="logon" class="navbar-item" href="/creative/my">
          <img class="avatar is-rounded" :src="avatar">
        </a>
        <div v-else class="navbar-item">
          <div class="buttons">
            <router-link class="button is-link" to="/register">
              <strong>注册</strong>
            </router-link>
            <router-link class="button is-light" to="/login">
              登录
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { resetToken } from '../../user/token'
import { getImageUrl } from '../../xd-builder/mixins/imageUtils'
import logo from '../D.png'
export default {
  name: 'NavBar',
  props: {},
  data () {
    return {
      menuShow: false,
      logo,
      user: this.ctx.user,
      isMobileOpened: false
    }
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
  created () {
    this.ctx.on && this.ctx.on('user-updated', (user) => {
      this.user = user
    })
  },
  
  mounted () {
    this.$router.beforeEach((to, from, next) => {
      this.isMobileOpened = false
      next()
    })
  },

  methods: {
    getImageUrl,

    toggleMenuShow () {
      this.menuShow = !this.menuShow
    },
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
