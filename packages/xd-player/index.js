export default {
  routes: [{
    path: '/work/frame/:id',
    component: () => import(/* webpackChunkName: "xd-player" */'./FramedPlayer.vue')
  }, {
    path: '/work/snapshot/:id',
    component: () => import(/* webpackChunkName: "xd-player" */'./SnapShotPreview.vue')
  }],
  async onload (ctx) { }
}
