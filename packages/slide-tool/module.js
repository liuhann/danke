export default {
  routes: [{
    path: '/slide-tool`',
    component: () => import(/* webpackChunkName: "slide-tool" */'./SlideEditor.vue')
  }],
  async onload (ctx) {
  }
}