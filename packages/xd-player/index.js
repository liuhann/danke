export default {
  routes: [{
    path: '/work/frame/:id',
    component: () => import(/* webpackChunkName: "xd-player" */'./FramedPlayer.vue')
  }],
  async onload (ctx) { }
}
