import AsyncBoot from 'async-boot'
import App from './app.vue'
import Nanobus from './packages/utils/nanobus'

import Vue from 'vue'
import VueRouter from 'vue-router'

import Vant from 'vant/lib/index'
import 'vant/lib/index.css'

import home from './packages/home'
import designer from './packages/designer'
import runtime from './packages/runtime'

import './common.css'
import './packages/animations/animista.css'
Vue.use(Vant)
Vue.use(VueRouter)
const boot = new AsyncBoot({
  vue: {
    Vue,
    VueRouter,
    rootApp: App,
    mount: '#app'
  },
  packages: [
    home, designer, runtime
  ],
  started: async (ctx, next) => {
    Object.assign(ctx.Vue.prototype, {
      nanobus: new Nanobus()
    })
    await next()
  }
})

boot.startUp()
