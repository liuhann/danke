import AnimationDAO from './animationdao'

export default {
  routes: [{
    path: '/frame/edit',
    component: () => import(/* webpackChunkName: "tool" */'./FrameTool.vue')
  }, {
    path: '/frames',
    component: () => import(/*webpackChunkName: "tool" */'./PageFrameList.vue')
  }],
  async onload (ctx) {
    ctx.animdao = new AnimationDAO(ctx)
  }
}
