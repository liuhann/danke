import AsyncBoot from 'async-boot'
import App from './app.vue'

import Vue from 'vue'
import VueRouter from 'vue-router'
import Vant, * as vant from 'vant/lib/index.js'
import ky from 'ky'
import home from '../packages/home'
import designer from '../packages/designer'
import runtime from '../packages/runtime'
import login from '../packages/login'
import './common.css'
import '../packages/animations/animista.css'
import 'vant/lib/index.css'
import WorkDAO from '../packages/dao/workdao'
import UserDAO from '../packages/dao/userdao'
import { shortid } from '../packages/utils/string'
Vue.use(Vant)
Vue.use(VueRouter)

const boot = new AsyncBoot({
  Vue,
  VueRouter,
  App,
  appServer: 'http://www.yuanbaogushi.com',
  mount: '#app',
  packages: [
    home, designer, runtime, login
  ],
  started: async (ctx, next) => {
    ctx.workdao = new WorkDAO(ctx)
    ctx.userdao = new UserDAO(ctx)

    let token = window.localStorage.getItem('dankeToken')
    if (!token) {
      token = shortid(12)
      window.localStorage.setItem('dankeToken', token)
    }
    const client = ky.extend({
      prefixUrl: 'http://www.yuanbaogushi.com/api/',
      searchParams: {
        'token': token
      }
    })
    ctx.ky = client
    ctx.get = client.get
    ctx.post = client.post
    ctx.delete = client.delete

    ctx.vant = vant
    await next()
  },
  upload: {
    maxSize: 2 * 1024 * 1024
  }
})
boot.startUp()
