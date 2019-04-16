export default {
  routes: [{
    path: '/',
    component: () => import(/* webpackPrefetch: true; webpackChunkName: "home" */'./user')
  }],
  async onload (ctx) {
  }
}
