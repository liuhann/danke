// 矢量图片资源
export default {
  routes: [{
    path: '/vector/edit',
    component: () => import(/* webpackChunkName: "vector" */'./PageVectorEdit.vue')
  }, {
    path: '/vector/list',
    component: () => import(/* webpackChunkName: "vector" */'./PageVectorList.vue')
  }, {
    path: '/clippath/list',
    component: () => import(/* webpackChunkName: "vector" */'./PageClippathList.vue')
  }, {
    path: '/clippath/edit',
    component: () => import(/* webpackChunkName: "vector" */'./PageClippathEdit.vue')
  }],
  async onload (ctx) {
  }
}
