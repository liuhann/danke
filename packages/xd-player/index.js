export default {
  routes: [{
    path: '/play/fit/:id',
    component: () => import(/* webpackChunkName: "xd-player" */'./FitPagePlay.vue')
  }, {
    path: '/play/full/:id',
    component: () => import(/* webpackChunkName: "xd-player" */'./FullPagePlay.vue')
  }, {
    path: '/page/:id',
    component: () => import(/* webpackChunkName: "xd-page-view" */'./OnePagePlay.vue')
  },],
  async onload (ctx) {
  }
}
