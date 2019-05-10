// styles
import './common.scss'
import '../packages/webfont/karla/font.css'
// import '../packages/webfont/fontello/css/fontello.css'
import AsyncBoot from 'async-boot'
import App from './app.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

// import home from '../packages/home'
import site from '../packages/site'
import designer from '../packages/designer'
import runtime from '../packages/runtime'
import user from '../packages/user'
import frameTool from '../packages/frame-tool'
import styleTool from '../packages/style-tool'
import ybstory from '../packages/story'

import initClient from '../packages/common/initClient'

Vue.use(VueRouter)
window.Vue = Vue

const boot = new AsyncBoot({
  Vue,
  VueRouter,
  App,
  mode: 'history',
  appServer: 'http://www.danke.fun',
  cdn: 'http://cdn.danke.fun',
  mount: '#app',
  packages: [
    site, designer, runtime, user, frameTool, styleTool, ybstory
  ],
  started: async (ctx, next) => {
    initClient(ctx)
    // ctx.user = await ctx.userdao.getCurrentUser()
    await next()
  },
  upload: {
    maxSize: 2 * 1024 * 1024
  }
})
boot.startUp()
