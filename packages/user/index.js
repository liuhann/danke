import UserDAO from './userdao'
export default {
  routes: [{
    path: '/user',
    component: () => import(/* webpackChunkName: "user" */'./Login.vue')
  }, {
    path: '/register',
    component: () => import(/* webpackChunkName: "user" */'./Register.vue')
  }],
  async onload (ctx) {
    ctx.userdao = new UserDAO(ctx)
  }
}
