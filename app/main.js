// styles
import './common.scss'
import '../packages/common/karla/font.css'
import AsyncBoot from 'async-boot'
import App from './app.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

import site from '../packages/site'
import user from '../packages/user'
import frameTool from '../packages/frames'
import restclient from '../packages/rest-client'
// import ybstory from '../packages/story'
import xd from '../packages/xd-builder'
import player from '../packages/xd-player'
import vectors from '../packages/vectors'
import adminDanke from '../packages/danke-admin'
import slideLite from '../packages/slide-lite'

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
  IMG_SERVER: 'http://image.danke.fun',
  mount: '#app',
  packages: [
    site, user, frameTool, xd, player, adminDanke, vectors, slideLite, restclient
  ],
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
