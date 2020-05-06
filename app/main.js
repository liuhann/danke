// styles
import './common.scss'
// import '../packages/common/karla/font.css'
import AsyncBoot from 'async-boot'
import App from './app.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

import site from '../packages/site'
import user from '../packages/user'
import restclient from '../packages/rest-client'
import initClient from '../packages/common/utils/initClient'
import initEventEmitter from '../packages/common/utils/initEventEmitter'

import dankePackages from './danke'

Vue.use(VueRouter)
window.Vue = Vue
const boot = new AsyncBoot({
  Vue,
  VueRouter,
  App,
  mode: 'history',
  appServer: 'http://www.danke.fun',
  cdn: 'http://cdn.danke.fun',
  IMG_SERVER: 'http://image.danke.fun',
  mount: '#app',
  packages: [
    site, user, restclient
  ].concat(dankePackages),
  started: async (ctx, next) => {
    ctx._router.beforeEach((to, from, next) => {
      to.meta.ctx = ctx
      next()
    })
    await next()
  },
  upload: {
    maxSize: 4 * 1024 * 1024
  }
})

// attach some global ctx services
initClient(boot.ctx, 'http://www.danke.fun/api/')
initEventEmitter(boot.ctx)

boot.startUp()
