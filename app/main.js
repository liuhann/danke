import './common.scss'
import '../packages/webfont/karla/font.css'
import '../packages/fontello/css/fontello.css'
import AsyncBoot from 'async-boot'
import App from './app.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

// import home from '../packages/home'
import site from '../packages/site'
import designer from '../packages/designer'
import runtime from '../packages/runtime'
import login from '../packages/login'
import frameTool from '../packages/frame-tool'
import styleTool from '../packages/style-editor/module'

import initClient from './middlewares/initClient'
import UserDAO from '../packages/login/userdao'
import AnimationDAO from '../packages/dao/animationdao'

// import WorkDAO from '../packages/dao/workdao'
// import UserDAO from '../packages/dao/userdao'

Vue.use(VueRouter)
window.Vue = Vue

const boot = new AsyncBoot({
  Vue,
  VueRouter,
  App,
  appServer: 'http://www.danke.fun',
  cdn: 'http://cdn.danke.fun',
  mount: '#app',
  packages: [
    site, designer, runtime, login, frameTool, styleTool
  ],
  started: async (ctx, next) => {
    initClient(ctx)
    ctx.userdao = new UserDAO(ctx)
    ctx.animdao = new AnimationDAO(ctx)
    ctx.user = await ctx.userdao.getCurrentUser()
    await next()
  },
  upload: {
    maxSize: 2 * 1024 * 1024
  }
})
boot.startUp()
