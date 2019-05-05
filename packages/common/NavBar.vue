<template>
  <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="https://bulma.io">
        <img src="http://www.danke.fun/res/logo.png" >
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
        <a class="navbar-item">
          桌面
        </a>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            工具
          </a>
          <div class="navbar-dropdown">
            <a class="navbar-item" href="/style-tool">
              样式元素
            </a>
            <a class="navbar-item" href="/frame-list">
              动画
            </a>
            <a class="navbar-item">
              轮播图
            </a>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div v-if="!avatar" class="buttons">
            <a class="button is-primary" @click="getStarted">
              <strong>开始使用</strong>
            </a>
          </div>
          <figure v-else class="image is-48x48" @click="goUserHome">
            <img :src="avatar" style="max-height: 48px!important;" width="48" height="48">
          </figure>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>

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

  },
  computed: {
    burgerOpen () {
      return this.isMobileOpened ? 'is-active' : ''
    },
    avatar () {
      if (this.user && this.user.id) {
        return this.user.avatar || this.ctx.cdn + '/res/user.png'
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
