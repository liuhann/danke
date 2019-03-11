export default {
  routes: [{
    path: '/',
    component: () => import(/* webpackChunkName: "home" */'./Home')
  }],
  async onload (ctx) {
  }
}
