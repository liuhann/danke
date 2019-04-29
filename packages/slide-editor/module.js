export default {
  routes: [{
    path: '/slide-tool',
    component: () => import(/* webpackChunkName: "style-tool" */'./SlideEditor.vue')
  }],
  async onload (ctx) {
  }
}