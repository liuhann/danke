// 矢量图片资源
export default {
  routes: [{
    path: '/gallery',
    component: () => import(/* webpackChunkName: "vectors" */'./Gallery.vue')
  }],
  async onload (ctx) {
  }
}
