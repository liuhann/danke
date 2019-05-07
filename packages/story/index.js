export default {
  routes: [{
    path: '/story',
    component: () => import(/*webpackChunkName: "story"*/'./Main.vue')
  }],
  async onload (ctx) {
    ctx.CDN_IMG = 'http://imagek.cdn.bcebos.com'
    ctx.CDN_STORY = 'http://chuchu.cdn.bcebos.com'
  }
}
