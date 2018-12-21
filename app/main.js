import TapAndHold from 'vue-tap-and-hold'
import VueDraggableResizable from 'vue-draggable-resizable'
import AsyncBoot from 'async-boot'
import config from './config'
import App from './app.vue'

import home from './packages/home'
import designer from './packages/designer'

import './common.css'
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
    ctx.Vue.use(VueDraggableResizable)
    await next()
  }
})

boot.startUp()
