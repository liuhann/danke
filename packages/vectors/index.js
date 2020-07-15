// 矢量图片资源
/**
 * 可修改颜色的SVG图片:  danke/svg
 * 可调整横纵比例的SVG裁切: danke/clippath
 */
export default {
  routes: [{
    path: '/path/edit',
    component: () => import(/* webpackChunkName: "vector" */'./SVGPathEditor.vue')
  }, {
    path: '/path/list',
    component: () => import(/* webpackChunkName: "vector" */'./PageSVGPathList.vue')
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
