export default {
  routes: [{
    path: '/frame-tool',
    component: () => import(/* webpackChunkName: "frame-tool" */'./FrameTool.vue')
  }, {
    path: '/frame-list',
    component: () => import(/*webpackChunkName: "frame-tool" */'./FrameList.vue')
  }],
  async onload (ctx) {
  }
}
