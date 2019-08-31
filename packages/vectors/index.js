export default {
  routes: [{
    path: '/vectors',
    component: () => import(/* webpackChunkName: "vectors" */'./Vectors.vue')
  }],
  async onload (ctx) {
  }
}
