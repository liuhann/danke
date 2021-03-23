<template>
  <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="http://www.danke.fun">
        <img :src="logo" />
      </a>
      <a class="navbar-item">{{ title }}</a>
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" @click="toggleMenuShow">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu">
      <div class="navbar-end">
        <div class="navbar-item bd-navbar-item bd-navbar-item-base has-dropdown is-hoverable">
          <a class="button is-primary mt-2">
            <strong>创建作品</strong>
          </a>
          <div class="navbar-dropdown bd-navbar-dropdown is-boxed is-right">
            <router-link class="navbar-item bd-is-hidden" to="/xd?width=1080&height=1920">
              <div>
                <div class="icon-text">
                  <span class="icon has-text-extensions">
                    <i class="fas fa-film"></i>
                  </span>
                  <span>
                    <strong>移动视频</strong>
                  </span>
                </div>
              </div>
            </router-link>
            <hr class="navbar-divider ">
            <router-link class="navbar-item bd-is-hidden" to="/xd?width=640&height=270">
              <div>
                <div class="icon-text">
                  <span class="icon">
                    <i class="fas fa-lemon-o"></i>
                  </span>
                  <span>
                    <strong>动画展示</strong>
                  </span>
                </div>
              </div>
            </router-link>
            
            <hr class="navbar-divider ">
            <a class="navbar-item" data-route="" href="https://bulma.io/alternative-to-bootstrap">
              <div>
                <div class="icon-text">
                  <span class="icon has-text-bootstrap">
                    <i class="fas fa-exchange-alt"></i>
                  </span>
                  <span>
                    <strong>Coming from Bootstrap</strong>
                  </span>
                </div>
                See how Bulma is an alternative to Bootstrap
              </div>
            </a>
          </div>
        </div>
        <div v-if="logon" class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link is-arrowless">
            <img class="avatar is-rounded" :src="avatar">
          </a>
          <div class="navbar-dropdown is-right">
            <router-link v-if="logon" class="navbar-item" to="/xd/center">
              创作中心首页
            </router-link>
            <hr class="navbar-divider">
            <router-link v-if="logon" class="navbar-item" to="/creative/profile">
              账号设置
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { getImageUrl } from '../utils/getImageUrl'
import logo from '../site/D.png'
export default {
  name: 'NavBar',
  props: {
    title: {
      type: String,
      default: '蛋壳分享'
    }
  },
  data () {
    return {
      logo,
      user: this.ctx.user
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
   
  },

  mounted () {},

  methods: {
    getImageUrl
  }
}
</script>

<style lang="scss">

</style>
