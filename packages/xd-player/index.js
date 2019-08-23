export default {
  routes: [{
    path: '/play/:mode/:id',
    component: () => import(/* webpackChunkName: "xd-player" */'./PagePlay.vue')
  }],
  async onload (ctx) {
  }
}
