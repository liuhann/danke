//  音乐节拍编辑器， 场景可按节拍进行切换
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
