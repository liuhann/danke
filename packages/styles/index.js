export default {
  routes: [{
    path: '/style/edit',
    component: () => import(/* webpackChunkName: "style-edit" */'./PageStyleEdit.vue')
  }, {
    path: '/style/list',
    component: () => import(/* webpackChunkName: "style-edit" */'./PageStyleList.vue')
  }],
  async onload (ctx) {
  }
}
