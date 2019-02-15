import AsyncBoot from 'async-boot'
import login from './packages/login'
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const boot = new AsyncBoot({
  Vue,
  VueRouter,
  mount: '#app',
  packages: [
    login
  ],
  started: async (ctx, next) => {
    await next()
  }
})

boot.startUp()
