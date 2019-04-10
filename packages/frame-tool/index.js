export default {
  routes: [{
    path: '/frame-tool',
    component: () => import(/* webpackChunkName: "frame-tool" */'./FrameTool.vue')
  }],
  async onload (ctx) {
  }
}
