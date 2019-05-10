import StoryDAO from './libs/storydao.js';
export default {
  routes: [{
    path: '/story',
    component: () => import(/*webpackChunkName: "story"*/'./Main.vue')
  }],
  async onload (ctx) {
    ctx.storydao = new StoryDAO(ctx)
  }
}
