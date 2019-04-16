export default {
  routes: [{
    path: '/',
    component: () => import(/* webpackPrefetch: true; webpackChunkName: "site" */'./Main.vue')
  }],
  async onload (ctx) {
  }
}
