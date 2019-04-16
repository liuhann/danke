export default {
  routes: [{
    path: '/frame-tool',
    component: () => import(/* webpackPrefetch: true; webpackChunkName: "frame-tool" */'./FrameTool.vue')
  }, {
    path: '/frame-list',
    component: () => import(/* webpackPrefetch: true; webpackChunkName: "frame-tool" */'./FrameList.vue')
  }],
  async onload (ctx) {
  }
}
