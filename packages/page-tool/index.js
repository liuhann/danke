export default {
  routes: [{
    path: '/page-tool',
    component: () => import(/* webpackChunkName: "style-tool" */'./PageTool.vue')
  }],
  async onload (ctx) {
  }
}
