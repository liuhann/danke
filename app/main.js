// styles
import './common.scss'
import '../packages/common/karla/font.css'
import AsyncBoot from 'async-boot'
import App from './app.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

// import home from '../packages/home'
import site from '../packages/site'
// import designer from '../packages/designer'
import runtime from '../packages/runtime'
import user from '../packages/user'
import frameTool from '../packages/frame-tool'
import pageTool from '../packages/page-tool'
import ybstory from '../packages/story'

import initClient from '../packages/common/utils/initClient'

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
    site, runtime, user, frameTool, pageTool, ybstory
  ],
  started: async (ctx, next) => {
    initClient(ctx)
    await next()
  },
  upload: {
    maxSize: 2 * 1024 * 1024
  }
})
boot.startUp()
