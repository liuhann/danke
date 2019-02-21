import AsyncBoot from 'async-boot'
import App from './app.vue'
import Nanobus from '../packages/utils/nanobus'

import Vue from 'vue'
import VueRouter from 'vue-router'

import Vant from 'vant/lib/index'
import 'vant/lib/index.css'

import home from '../packages/home'
import designer from '../packages/designer'
import runtime from '../packages/runtime'

import './common.css'
import '../packages/animations/animista.css'
import WorkDAO from '../packages/dao/workdao'
Vue.use(Vant)
Vue.use(VueRouter)
const boot = new AsyncBoot({
  Vue,
  VueRouter,
  App,
  appServer: 'http://www.yuanbaogushi.com',
  mount: '#app',
  packages: [
    home, designer, runtime
  ],
  started: async (ctx, next) => {
    ctx.workdao = new WorkDAO(ctx.appServer)
    Object.assign(ctx.Vue.prototype, {
      nanobus: new Nanobus()
    })
    await next()
  },
  upload: {
    maxSize: 2 * 1024 * 1024
  }
})
boot.startUp()
