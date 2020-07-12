export default {
  routes: [{
    path: '/filter/edit',
    component: () => import(/* webpackChunkName: "style-edit" */'./PageFilterEdit.vue')
  }, {
    path: '/filter/list',
    component: () => import(/* webpackChunkName: "style-edit" */'./PageFilterList.vue')
  }],
  async onload (ctx) {
  }
}
