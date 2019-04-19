import AnimationDAO from './animationdao'

export default {
  routes: [{
    path: '/frame-tool',
    component: () => import(/* webpackChunkName: "frame-tool" */'./FrameTool.vue')
  }, {
    path: '/frame-list',
    component: () => import(/*webpackChunkName: "frame-tool" */'./PageFrameList.vue')
  }],
  async onload (ctx) {
    ctx.animdao = new AnimationDAO(ctx)
  }

}
