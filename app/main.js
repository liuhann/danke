import AsyncBoot from 'async-boot'
import config from './config'
import App from './app.vue'
import Nanobus from './packages/utils/nanobus'

import Vue from 'vue'
import VueRouter from 'vue-router'

import Vant from 'vant/lib/index'
import 'vant/lib/index.css'

import home from './packages/home'
import designer from './packages/designer'

import './common.css'
Vue.use(Vant)
Vue.use(VueRouter)
const boot = new AsyncBoot({
  vue: {
    rootApp: App,
    mount: '#app'
  },
  servers: config.servers,
  packages: [
    home, designer
  ],
  started: async (ctx, next) => {
    Object.assign(ctx.Vue.prototype, {
      nanobus: new Nanobus()
    })
    await next()
  }
})

boot.startUp()
