import 'normalize.css'

import AsyncBoot from 'async-boot'
import App from './app.vue'
import login from '../packages/login'
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const boot = new AsyncBoot({
  Vue,
  VueRouter,
  App,
  mount: '#app',
  packages: [
    login
  ],
  started: async (ctx, next) => {
    await next()
  }
})

boot.startUp()
