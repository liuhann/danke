import UserDAO from './userdao'
import { getToken, resetToken } from './token'
import sleep from '../common/utils/sleep'
export default {
  checkLogin : (to, from, next) => {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
    if (!to.meta.ctx.user.id) {
      to.meta.ctx.toPath = to.path
      next('/login')
    } else {
      next()
    }
  },

  routes: [{
    path: '/login',
    component: () => import(/* webpackChunkName: "user" */'./Login.vue')
  }, {
    path: '/register',
    component: () => import(/* webpackChunkName: "user" */'./Register.vue')
  }],
  async onload (ctx) {

    ctx.userdao = new UserDAO(ctx)
    const mi = new Date().getTime()
    ctx.user = await ctx.userdao.getCurrentUser()
    // const dura = new Date().getTime() - mi
    //
    // if (dura < 500) {
    //   await sleep( 700 - dura)
    // }
  }
}
