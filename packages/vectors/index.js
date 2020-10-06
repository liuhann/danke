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
    path: '/h5/list',
    component: () => import(/* webpackChunkName: "vector" */'./PageHtmlList.vue')
  }, {
    path: '/h5/edit',
    component: () => import(/* webpackChunkName: "vector" */'./PageHtmlEdit.vue')
  }],
  async onload (ctx) {
  }
}
