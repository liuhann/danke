export default {
  routes: [{
    path: '/tick/edit',
    component: () => import(/* webpackChunkName: "tick-tool" */'./PageEditMusicTick.vue')
  }, {
    path: '/tick/list',
    component: () => import(/* webpackChunkName: "frames-tool" */'./PageTickList.vue')
  }],
  async onload (ctx) { }
}
