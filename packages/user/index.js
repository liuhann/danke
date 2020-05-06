import UserDAO from './userdao'
import { getToken, resetToken } from './token'
import sleep from '../common/utils/sleep'
export default {
  routes: [{
    path: '/login',
    component: () => import(/* webpackChunkName: "user" */'./Login.vue')
  }, {
    path: '/user',
    component: () => import(/* webpackChunkName: "user" */'./UserProfile.vue')
  }, {
    path: '/register',
    component: () => import(/* webpackChunkName: "user" */'./Register.vue')
  }],
  async onload (ctx) {
    ctx.token = getToken()
    ctx.userdao = new UserDAO(ctx)
    const mi = new Date().getTime()
    ctx.user = await ctx.userdao.getCurrentUser()
    const dura = new Date().getTime() - mi

    if (dura < 700) {
      await sleep( 700 - dura)
    }
  }
}
