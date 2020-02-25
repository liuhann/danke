// 矢量图片资源
export default {
  routes: [{
    path: '/svg/edit',
    component: () => import(/* webpackChunkName: "svg" */'./PageSVGEdit.vue')
  }, {
    path: '/svg/list',
    component: () => import(/* webpackChunkName: "svg" */'./PageSVGList.vue')
  }],
  async onload (ctx) {
  }
}
