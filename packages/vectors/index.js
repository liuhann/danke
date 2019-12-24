export default {
  routes: [{
    path: '/gallery',
    component: () => import(/* webpackChunkName: "vectors" */'./Gallery.vue')
  }],
  async onload (ctx) {
  }
}
