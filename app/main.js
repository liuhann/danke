import AsyncBoot from 'async-boot'
import App from './app.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'
import ky from 'ky'

import home from '../packages/home'
import designer from '../packages/designer'
import runtime from '../packages/runtime'
import login from '../packages/login'

import WorkDAO from '../packages/dao/workdao'
import UserDAO from '../packages/dao/userdao'
import { shortid } from '../packages/utils/string'

Vue.use(VueRouter)
window.Vue = Vue

const boot = new AsyncBoot({
  Vue,
  VueRouter,
  App,
  appServer: 'http://www.danke.fun',
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
      prefixUrl: 'http://www.danke.fun/api/',
      throwHttpErrors: false,
      searchParams: {
        'token': token
      },
      hooks: {
        afterResponse: [
          response => {
            // You could do something with the response, for example, logging.
            if (response.status === 200) {
              return response
            } else {
              if (response.status === 401) {
                ctx._router.replace('/login')
              } else {
                throw new Error()
              }
              throw new Error()
            }
            // Or return a `Response` instance to overwrite the response.
            // return new Response('A different response', {status: 200});
          }
        ]
      }
    })
    ctx.ky = client
    ctx.get = client.get
    ctx.post = client.post
    ctx.delete = client.delete
    await next()
  },
  upload: {
    maxSize: 2 * 1024 * 1024
  }
})
boot.startUp()
