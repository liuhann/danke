import UserDAO from './userdao'
import { getToken, resetToken } from './token'
export default {
  routes: [{
    path: '/login',
    component: () => import(/* webpackChunkName: "user" */'./Login.vue')
  }, {
    path: '/user',
    component: () => import(/* webpackChunkName: "user" */'./UserHome.vue')
  }, {
    path: '/register',
    component: () => import(/* webpackChunkName: "user" */'./Register.vue')
  }],
  async onload (ctx) {
    ctx.token = getToken()
    ctx.userdao = new UserDAO(ctx)
    ctx.userdao.getCurrentUser().then((data) => {
      ctx.user = data
      ctx.emit && ctx.emit('user-updated', data)
    })
  }
}
