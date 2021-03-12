<template>
  <nav class="navbar has-shadow" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="http://www.danke.fun">
        <img :src="logo" />
      </a>
      <a class="navbar-item">{{ title }}</a>
      <a role="button" class="navbar-burger" :class="menuShow? 'is-active': ''" aria-label="menu" aria-expanded="false" @click="toggleMenuShow">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" :class="menuShow? 'is-active': ''">
      <div id="navbarStartOriginal" class="navbar-start bd-navbar-start bd-is-original">
        <a class="
      navbar-item bd-navbar-item bd-navbar-item-base bd-navbar-item-documentation

      is-active
    " href="https://bulma.io/documentation"
        >
          <span class="icon has-text-primary">
            <i class="fas fa-book"></i>
          </span>
          <span class="is-hidden-tablet-only is-hidden-desktop-only">
            Documentation
          </span>
          <span class="is-hidden-mobile is-hidden-widescreen">
            Docs
          </span>
        </a>





        <a class="
  navbar-item
  bd-navbar-item
  bd-navbar-item-videos
  bd-navbar-item-base


" href="https://bulma.io/videos/"
        >
          <span class="icon has-text-success">
            <i class="fas fa-play-circle"></i>
          </span>

          <span>Videos</span>
        </a>





        <a class="
  navbar-item
  bd-navbar-item
  bd-navbar-item-expo
  bd-navbar-item-base


" href="https://bulma.io/expo/"
        >
          <span class="icon has-text-expo">
            <i class="fas fa-star"></i>
          </span>

          <span>Expo</span>
        </a>





        <a class="
  navbar-item
  bd-navbar-item
  bd-navbar-item-love
  bd-navbar-item-base


" href="https://bulma.io/love/"
        >
          <span class="icon has-text-love">
            <i class="fas fa-heart"></i>
          </span>

          <span>Love</span>
        </a>





        <a class="
  navbar-item
  bd-navbar-item
  bd-navbar-item-backers
  bd-navbar-item-base


" href="https://bulma.io/backers/"
        >
          <span class="icon has-text-patreon">
            <i class="fab fa-patreon"></i>
          </span>

          <span>Backers</span>
        </a>







        <a class="navbar-item bd-navbar-item bd-navbar-item-extensions bd-navbar-item-more bd-is-visible" href="https://bulma.io/extensions/">
          <span class="icon has-text-extensions">
            <i class="fas fa-plug"></i>
          </span>

          <span>Extensions</span>
        </a>





        <a class="navbar-item bd-navbar-item bd-navbar-item-bulma-book bd-navbar-item-more" href="https://bulma.io/the-official-bulma-book/">
          <span class="icon has-text-bleeding">
            <i class="fas fa-bookmark"></i>
          </span>

          <span>Book</span>
        </a>





        <a class="navbar-item bd-navbar-item bd-navbar-item-blog bd-navbar-item-more" href="https://bulma.io/blog/">
          <span class="icon has-text-rss">
            <i class="fas fa-rss"></i>
          </span>
          <span>头像装饰</span>
        </a>
        <a class="navbar-item bd-navbar-item bd-navbar-item-bulma-start bd-navbar-item-more" href="https://bulma.io/bulma-start/">
          <span class="icon has-text-success">
            <i class="fas fa-rocket"></i>
          </span>
          <span>创作中心</span>
        </a>
        <div class="navbar-item bd-navbar-item bd-navbar-item-base has-dropdown is-hoverable">
          <a class="navbar-link bd-navbar-ellipsis" href="https://bulma.io/more">
            <span class="icon">
              <i class="fas fa-ellipsis-h"></i>
            </span>
          </a>

          <div class="navbar-dropdown bd-navbar-dropdown is-boxed">
            <a class="navbar-item bd-is-hidden" data-route="" href="https://bulma.io/extensions">
              <div>
                <div class="icon-text">
                  <span class="icon has-text-extensions">
                    <i class="fas fa-plug"></i>
                  </span>
                  <span>
                    <strong>Bulma extensions</strong>
                  </span>
                </div>
                Side projects to enhance Bulma
              </div>

            </a>

            <hr class="navbar-divider ">




            <a class="navbar-item" data-route="" href="https://bulma.io/the-official-bulma-book">
              <div>
                <div class="icon-text">
                  <span class="icon has-text-bleeding">
                    <i class="fas fa-bookmark"></i>
                  </span>
                  <span>
                    <strong>The official Bulma book</strong>
                  </span>
                </div>
                A step-by-step guide that teaches you how to build a web interface from scratch using Bulma
              </div>

            </a>

            <hr class="navbar-divider ">




            <a class="navbar-item" data-route="" href="https://bulma.io/blog">
              <div>
                <div class="icon-text">
                  <span class="icon has-text-rss">
                    <i class="fas fa-rss"></i>
                  </span>
                  <span>
                    <strong>Blog</strong>
                  </span>
                </div>
                Stay updated with new features
              </div>

            </a>

            <hr class="navbar-divider ">




            <a class="navbar-item" data-route="" href="https://bulma.io/bulma-start">
              <div>
                <div class="icon-text">
                  <span class="icon has-text-success">
                    <i class="fas fa-rocket"></i>
                  </span>
                  <span>
                    <strong>Bulma start</strong>
                  </span>
                </div>
                A tiny npm package to get started
              </div>

            </a>

            <hr class="navbar-divider ">




            <a class="navbar-item" data-route="" href="https://bulma.io/made-with-bulma">
              <div>
                <div class="icon-text">
                  <span class="icon has-text-warning">
                    <i class="fas fa-certificate"></i>
                  </span>
                  <span>
                    <strong>Made with Bulma</strong>
                  </span>
                </div>
                The official community badge
              </div>

            </a>

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
      </div>
      <div class="navbar-end">
        <div v-if="logon" class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link is-arrowless">
            <img class="avatar is-rounded" :src="avatar">
          </a>
          <div class="navbar-dropdown is-right">
            <router-link v-if="logon" class="navbar-item" to="/creative/my">
              创作中心首页
            </router-link>
            <hr class="navbar-divider">
            <router-link v-if="logon" class="navbar-item" to="/creative/profile">
              账号设置
            </router-link>
          </div>
        </div>

        <div v-if="!logon" class="navbar-item">
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
import { getImageUrl } from '../../utils/getImageUrl'
import logo from '../D.png'
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
