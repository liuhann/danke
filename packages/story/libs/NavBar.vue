<template>
  <div class="nav-top-fixed">
    <div class="centered">
      <a v-for="(nav, index) in navs" :key="nav" class="nav-item" :class="currentNav===index? 'selected': ''" @click='go(index)'>
        {{nav}}
      </a>
    </div>
    <div class="right-search">
      <i class="icon-search" @click="search"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  props: {

  },
  data () {
    return {
      navs: ['推荐', '发现', '我的'],
      currentNav: 0
    }
  },
  created () {

  },

  mounted () {
    
  },

  methods: {
    go (n) {
      this.currentNav = n
      this.$emit('go', n)
    },
    search () {
      this.$emit('search')
    }
  }
}
</script>

<style lang="scss">
.nav-top-fixed {
  position: fixed;
  height: 3.25rem;
  top: 0;
  z-index: 9999;
  background: #fff;
  width: 100%;
  font-size: 1.5rem;
  line-height: 3.25rem;
  color: #999;
  font-weight: 400;
  text-align: center;
  .centered {
    margin: 0 auto;
    display: inline-block;
    .nav-item {
      padding: 0 .4rem;
      &.selected {
        color: #444;
        font-weight: 600;
      }
    }
  }
  .right-search {
    float: right;
  }
}
</style>
