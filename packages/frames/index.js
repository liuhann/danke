import AnimationDAO from './animationdao'
export default {
  routes: [{
    path: '/frame/edit',
    component: () => import(/* webpackChunkName: "frames-tool" */'./PageEditFrame.vue')
  }, {
    path: '/frame/list',
    component: () => import(/* webpackChunkName: "frames-tool" */'./PageFrameList.vue')
  }],
  async onload (ctx) {
    ctx.animdao = new AnimationDAO(ctx)
  }
}
