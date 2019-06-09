import AnimationDAO from './animationdao'

export default {
  routes: [{
    path: '/builder-frame',
    component: () => import(/* webpackChunkName: "tool" */'./FrameTool.vue')
  }, {
    path: '/frame-list',
    component: () => import(/*webpackChunkName: "tool" */'./PageFrameList.vue')
  }],
  async onload (ctx) {
    ctx.animdao = new AnimationDAO(ctx)
  }
}
