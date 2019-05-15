export default {
  routes: [{
    path: '/home',
    component: () => import(/* webpackPrefetch: true; webpackChunkName: "home" */'./user')
  }],
  async onload (ctx) {
  }
}
