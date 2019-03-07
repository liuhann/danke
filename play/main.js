import AsyncBoot from 'async-boot'
import App from './app.vue'
import Vue from 'vue'
import ky from 'ky'
import runtime from '../packages/runtime'
import '../packages/animations/animista.css'
import WorkDAO from '../packages/dao/workdao'
import VueRouter from 'vue-router'

const boot = new AsyncBoot({
  Vue,
  VueRouter,
  App,
  appServer: 'http://www.danke.fun',
  mount: '#app',
  packages: [
    runtime
  ],
  started: async (ctx, next) => {
    ctx.workdao = new WorkDAO(ctx)

    let token = window.localStorage.getItem('dankeToken')
    if (!token) {
      window.localStorage.setItem('dankeToken', token)
    }
    const client = ky.extend({
      prefixUrl: 'http://www.danke.fun/api/',
      throwHttpErrors: false,
      searchParams: {
        'token': token
      }
    })
    ctx.ky = client
    ctx.get = client.get
    ctx.post = client.post
    ctx.delete = client.delete
    await next()
  }
})
boot.startUp()
