// styles
import './common.scss'
import '../packages/common/karla/font.css'
import AsyncBoot from 'async-boot'
import App from './app.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

// import home from '../packages/home'
// import designer from '../packages/designer'

import site from '../packages/site'
import runtime from '../packages/runtime'
import user from '../packages/user'
import frameTool from '../packages/frames'
import pageTool from '../packages/scenes'
import ybstory from '../packages/story'

import initClient from '../packages/common/utils/initClient'
import initEventEmitter from '../packages/common/utils/initEventEmitter'

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
    await next()
  },
  upload: {
    maxSize: 2 * 1024 * 1024
  }
})

// attach some global ctx services
initClient(boot.ctx, 'http://www.danke.fun/api/')
initEventEmitter(boot.ctx)

boot.startUp()
