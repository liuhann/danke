import AsyncBoot from 'async-boot'
// import App from './app.vue'

import Vue from 'vue'
import VueRouter from 'vue-router'

import Vant from 'vant/lib/index'
import 'vant/lib/index.css'

Vue.use(Vant)
Vue.use(VueRouter)

const boot = new AsyncBoot({
  vue: {
    Vue,
    VueRouter,
    // rootApp: {},
    mount: '#app'
  },
  packages: [
  ],
  started: async (ctx, next) => {
    await next()
  }
})

boot.startUp()
