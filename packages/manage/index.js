export default {
  routes: [{
    path: '/vector/manage',
    component: () => import(/* webpackChunkName: "manage" */'./AssetsPackManage.vue')
  }, {
    path: '/vector/edit',
    component: () => import(/* webpackChunkName: "manage" */'./PageAssetsEdit.vue')
  }],
  async onload (ctx) {
  }
}
