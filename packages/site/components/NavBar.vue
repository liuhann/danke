<template>
  <div id="header" class="nav-wrapper" role="navigation" aria-label="main navigation">
    <div class="container">
      <div id="logo" class="nav-logo">
        <a class="navbar-item" href="/" :style="{
            '--fillColor0': '#BCBCBC',
            '--fillColor1': '#35B0F6'
          }">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                     viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
              <g>
                <rect x="251.048" y="36" style="fill:var(--fillColor0);" width="9.896" height="9.6"/>
                <path style="fill:var(--fillColor0);" d="M260.944,471.296h-9.896v-19.36h9.896V471.296z M260.944,432.576h-9.896v-19.352h9.896V432.576z
                   M260.944,393.864h-9.896v-19.36h9.896V393.864z M260.944,355.16h-9.896V335.8h9.896V355.16z M260.944,316.44h-9.896v-19.352h9.896
                  V316.44z M260.944,277.728h-9.896v-19.36h9.896V277.728z M260.944,239.008h-9.896v-19.352h9.896V239.008z M260.944,200.296h-9.896
                  v-19.352h9.896V200.296z M260.944,161.584h-9.896v-19.36h9.896V161.584z M260.944,122.872h-9.896V103.52h9.896V122.872z
                   M260.944,84.16h-9.896V64.8h9.896V84.16z"/>
                <rect x="251.048" y="491.2" style="fill:var(--fillColor0);" width="9.896" height="9.592"/>
                <rect x="33.448" y="138.4" style="fill:var(--fillColor0);" width="9.896" height="10.4"/>
                <path style="fill:var(--fillColor0);" d="M43.352,367.336h-9.904v-18.264h9.896v18.264H43.352z M43.352,330.808h-9.904v-18.264h9.896v18.264
                  H43.352z M43.352,294.264h-9.904V276h9.896v18.264H43.352z M43.352,257.736h-9.904v-18.264h9.896v18.264H43.352z M43.352,221.2
                  h-9.904v-18.264h9.896V221.2H43.352z M43.352,184.664h-9.904V166.4h9.896v18.264H43.352z"/>
                <rect x="33.448" y="385.6" style="fill:var(--fillColor0);" width="9.896" height="10.4"/>
                <rect x="468.64" y="138.4" style="fill:var(--fillColor0);" width="9.888" height="10.4"/>
                <path style="fill:var(--fillColor0);" d="M478.544,367.336h-9.888v-18.264h9.888V367.336z M478.544,330.808h-9.888v-18.264h9.888V330.808z
                   M478.544,294.264h-9.888V276h9.888V294.264z M478.544,257.736h-9.888v-18.264h9.888V257.736z M478.544,221.2h-9.888v-18.264h9.888
                  V221.2z M478.544,184.664h-9.888V166.4h9.888V184.664z"/>
                <rect x="468.64" y="385.6" style="fill:var(--fillColor0);" width="9.888" height="10.4"/>
                <path style="fill:var(--fillColor0);" d="M259.2,265.72l-14.328-8.304l4.96-8.56l9.368,5.432l2.792-1.624l4.968,8.56L259.2,265.72z
                   M284.088,251.304l-4.968-8.56l17.12-9.92l4.968,8.56L284.088,251.304z M227.752,247.496l-17.12-9.92l4.96-8.56l17.12,9.92
                  L227.752,247.496z M318.32,231.456l-4.952-8.56l17.128-9.92l4.952,8.56L318.32,231.456z M193.504,227.648l-17.12-9.928l4.96-8.56
                  l17.12,9.928L193.504,227.648z M352.56,211.608l-4.952-8.56l17.128-9.92l4.952,8.56L352.56,211.608z M159.264,207.8l-17.12-9.92
                  l4.96-8.56l17.12,9.92L159.264,207.8z M386.8,191.76l-4.952-8.56l17.128-9.92l4.952,8.56L386.8,191.76z M125.016,187.96
                  l-17.12-9.92l4.96-8.56l17.12,9.92L125.016,187.96z M421.064,171.92l-4.968-8.56l17.12-9.928l4.968,8.56L421.064,171.92z
                   M90.776,168.112l-17.12-9.92l4.96-8.56l17.12,9.92L90.776,168.112z M455.296,152.072l-4.952-8.56l17.128-9.92l4.952,8.56
                  L455.296,152.072z M56.528,148.264l-18.864-10.936l25.704-13.144L67.872,133l-9.536,4.88l3.16,1.832L56.528,148.264z M451,133.24
                  l-17.616-9.008l4.504-8.816l17.616,9.008L451,133.24z M85.488,123.992l-4.504-8.816l17.624-9.008l4.504,8.816L85.488,123.992z
                   M415.76,115.216l-17.616-9.008l4.504-8.816l17.616,9.008L415.76,115.216z M120.728,105.968l-4.504-8.816l17.624-9.008l4.504,8.816
                  L120.728,105.968z M380.52,97.2l-17.624-9.008l4.504-8.816l17.624,9.008L380.52,97.2z M155.968,87.952l-4.504-8.816l17.616-9.008
                  l4.504,8.816L155.968,87.952z M345.28,79.176l-17.616-9.008l4.504-8.816l17.616,9.008L345.28,79.176z M191.208,69.928l-4.504-8.808
                  l17.624-9.008l4.504,8.816L191.208,69.928z M310.048,61.16l-17.624-9.008l4.504-8.816l17.624,9.008L310.048,61.16z M226.448,51.912
                  l-4.504-8.816l17.624-9.008l4.504,8.816L226.448,51.912z M274.8,43.136l-17.624-9.008l4.504-8.816l17.616,9.008L274.8,43.136z"/>
                <path style="fill:var(--fillColor0);" d="M259.2,493.728l-14.6-8.512l4.984-8.544l9.616,5.608l2.496-1.456l4.984,8.544L259.2,493.728z
                   M283.768,479.392l-4.984-8.544l17.096-9.968l4.984,8.544L283.768,479.392z M227.504,475.232l-17.096-9.968l4.984-8.544
                  l17.096,9.968L227.504,475.232z M317.96,459.456l-4.984-8.544l17.096-9.976l4.984,8.544L317.96,459.456z M193.32,455.296
                  l-17.096-9.976l4.984-8.544l17.096,9.976L193.32,455.296z M352.144,439.504l-4.984-8.544l17.096-9.976l4.984,8.544L352.144,439.504
                  z M159.128,435.352l-17.096-9.968l4.984-8.544l17.096,9.968L159.128,435.352z M386.336,419.56l-4.984-8.544l17.096-9.968
                  l4.984,8.544L386.336,419.56z M124.944,415.408l-17.096-9.968l4.984-8.544l17.096,9.968L124.944,415.408z M420.52,399.616
                  l-4.984-8.544l17.096-9.968l4.984,8.544L420.52,399.616z M90.76,395.472l-17.096-9.976l4.984-8.544l17.096,9.976L90.76,395.472z
                   M454.712,379.68l-4.984-8.544l17.096-9.976l4.984,8.544L454.712,379.68z M56.568,375.52l-18.912-11.032l25.752-13.064l4.48,8.832
                  l-9.544,4.84l3.216,1.872L56.568,375.52z M451.632,360.824l-17.648-8.952l4.488-8.832l17.648,8.952L451.632,360.824z
                   M85.528,351.296l-4.48-8.832l17.648-8.952l4.48,8.832L85.528,351.296z M416.336,342.912l-17.64-8.96l4.488-8.832l17.64,8.96
                  L416.336,342.912z M120.824,333.384l-4.48-8.832l17.648-8.952l4.48,8.832L120.824,333.384z M381.048,325l-17.648-8.96l4.488-8.832
                  l17.648,8.96L381.048,325z M156.112,315.472l-4.48-8.832l17.648-8.952l4.48,8.832L156.112,315.472z M345.752,307.088l-17.64-8.96
                  l4.488-8.832l17.64,8.96L345.752,307.088z M191.416,297.552l-4.48-8.832l17.648-8.952l4.48,8.832L191.416,297.552z
                   M310.456,289.168l-17.648-8.96l4.488-8.832l17.648,8.96L310.456,289.168z M226.712,279.648l-4.488-8.832l17.648-8.96l4.488,8.824
                  L226.712,279.648z M275.16,271.256l-17.64-8.96l4.48-8.824l17.648,8.96L275.16,271.256z"/>
              </g>
                          <g>
                <circle style="fill:var(--fillColor1);" cx="44.8" cy="134.4" r="27.2"/>
                            <circle style="fill:var(--fillColor1);" cx="467.2" cy="134.4" r="27.2"/>
                            <circle style="fill:var(--fillColor1);" cx="467.2" cy="386.4" r="27.2"/>
                            <circle style="fill:var(--fillColor1);" cx="44.8" cy="386.4" r="27.2"/>
                            <circle style="fill:var(--fillColor1);" cx="256" cy="257.6" r="27.2"/>
                            <circle style="fill:var(--fillColor1);" cx="256" cy="27.2" r="27.2"/>
                            <circle style="fill:var(--fillColor1);" cx="256" cy="484.8" r="27.2"/>
              </g>
              </svg>
        </a>
      </div>
      <div class="navbar-end">
        <div class="navbar-item" v-if="!logon">
          <div class="buttons">
            <router-link class="button is-light" to="/login">登录</router-link>
            <router-link class="button form-sub" to="/register"><strong>注册</strong></router-link>
          </div>
        </div>
        <router-link v-if="logon" class="navbar-item" :tag="div" to="/creative/my">
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
    height: 80px;
    line-height: 80px;
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
  height: 60px;
  #logo {
    a {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80px;
    }
    svg {
      width: 40px;
      height: 40px;
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
</style>
