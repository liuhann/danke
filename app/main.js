import TapAndHold from 'vue-tap-and-hold'

import AsyncBoot from 'async-boot'
import config from './config'
import App from './app.vue'

import home from './packages/home'
import designer from './packages/designer'


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
    ctx.Vue.use(TapAndHold)
    await next()
  }
})

boot.startUp()
