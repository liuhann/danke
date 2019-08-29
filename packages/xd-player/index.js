export default {
  routes: [{
    path: '/play/:id',
    component: () => import(/* webpackChunkName: "xd-player" */'./PagePlay.vue')
  }],
  async onload (ctx) {
  }
}
