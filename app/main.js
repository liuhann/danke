import AsyncBoot from 'async-boot'
import config from './config'
import App from './app.vue'

import home from './packages/home'

const boot = new AsyncBoot({
  vue: {
    rootApp: App,
    mount: '#app'
  },
  servers: config.servers,
  packages: [
    home
  ],
  started: async (ctx, next) => {
    console.log(location.href)
    if (!location.href.match('home')) {
      ctx._router.replace('/home')
    }
    await next()
  }
})

boot.startUp()
