export default {
  routes: [{
    path: '/',
    component: () => import(/* webpackChunkName: "home" */'./Main.vue')
  }],
  async onload (ctx) {
  }
}
