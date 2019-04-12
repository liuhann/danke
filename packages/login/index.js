import UserDAO from './userdao'
export default {
  routes: [{
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */'./Login.vue')
  }, {
    path: '/register',
    component: () => import(/* webpackChunkName: "login" */'./Register.vue')
  }],
  async onload (ctx) {

  }
}
