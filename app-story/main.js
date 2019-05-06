import './common.scss'
import App from './app.vue'
import Vue from 'vue'
import AsyncBoot from 'async-boot'

const boot = new AsyncBoot({
  Vue,
  App,
  router: false,
  mode: 'history',
  appServer: 'http://www.danke.fun',
  cdn: 'http://cdn.danke.fun',
  mount: '#app',
  packages: [],
  started: async (ctx, next) => {
    await next()
  }
})
boot.startUp()
