export default {
  routes: [{
    path: '/page-tool/:id?/:screen?',
    component: () => import(/* webpackChunkName: "style-tool" */'./PageTool.vue')
  }, {
    path: '/page-list',
    component: () => import(/* webpackChunkName: "style-tool" */'./PageList.vue')
  }],
  async onload (ctx) {

  }
}
