export default {
  routes: [{
    path: '/play/fit/:id',
    component: () => import(/* webpackChunkName: "xd-player" */'./FitPagePlay.vue')
  }, {
    path: '/play/full/:id',
    component: () => import(/* webpackChunkName: "xd-player" */'./FullPagePlay.vue')
  }],
  async onload (ctx) {
  }
}
