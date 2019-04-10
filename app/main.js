import './common.scss'

import AsyncBoot from 'async-boot'
import App from './app.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

// import home from '../packages/home'
import site from '../packages/site'
import designer from '../packages/designer'
import runtime from '../packages/runtime'
import login from '../packages/login'
import frameTool from '../packages/frame-tool'

import initClient from './middlewares/initClient'
import initLang from './middlewares/i18n'

// import WorkDAO from '../packages/dao/workdao'
// import UserDAO from '../packages/dao/userdao'

Vue.use(VueRouter)
window.Vue = Vue

const boot = new AsyncBoot({
  Vue,
  VueRouter,
  App,
  appServer: 'http://www.danke.fun',
  mount: '#app',
  packages: [
    site, designer, runtime, login, frameTool
  ],
  started: async (ctx, next) => {
    initClient(ctx)
    initLang(ctx)
    await next()
  },
  upload: {
    maxSize: 2 * 1024 * 1024
  }
})
boot.startUp()
