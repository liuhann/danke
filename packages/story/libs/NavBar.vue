<template>
  <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="https://bulma.io">
        <img src="http://www.danke.fun/res/logo.png" >
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu" :class="burgerOpen">
      <div class="navbar-start">
        <a class="navbar-item">
          推荐
        </a>
        <a class="navbar-item">
          分类
        </a>
        <a class="navbar-item">
          我的
        </a>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          
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
    }
  },
  created () {

  },
  computed: {

  },

  mounted () {
    
  },

  methods: {
    toggleOpen () {

    },
    getStarted () {
      
    },
    goUserHome () {
      
    }
  }
}
</script>

<style lang="scss">
</style>
