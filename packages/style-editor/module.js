export default {
  routes: [{
    path: '/style-tool',
    component: () => import(/* webpackChunkName: "style-tool" */'./StyleTool.vue')
  }],
  async onload (ctx) {
  }
}
