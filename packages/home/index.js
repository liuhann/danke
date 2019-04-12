export default {
  routes: [{
    path: '/',
    component: () => import(/* webpackChunkName: "home" */'./user')
  }],
  async onload (ctx) {
  }
}
