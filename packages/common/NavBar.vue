<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
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
            <a class="navbar-item">
              样式元素
            </a>
            <a class="navbar-item" href="#/frame-tool">
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
          <div class="buttons">
            <a class="button is-primary" @click="getStarted">
              <strong>开始使用</strong>
            </a>
            <a class="button is-link">
              注册
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>

export default {
  name: 'NavBar',
  data () {
    return {
      isMobileOpened: false
    }
  },
  created () {

  },
  computed: {
    burgerOpen () {
      return this.isMobileOpened ? 'is-active' : ''
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
    t (v) {
      return this.polyglot.t(v)
    },
    getStarted () {
      location.href = 'https://github.com/login/oauth/authorize?scope=user:email&client_id=9b1eec30dbf5235a78b3'
      //this.$router.push('/designer/full')
    },
    switchLang() {

    }
  }
}
</script>

<style lang="scss">
</style>
