// 矢量图片资源
export default {
  routes: [{
    path: '/svg/edit',
    component: () => import(/* webpackChunkName: "svg" */'./PageSVGEdit.vue')
  }],
  async onload (ctx) {
  }
}
