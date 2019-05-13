import StoryDAO from './libs/storydao.js';
export default {
  routes: [{
    path: '/story',
    component: () => import(/*webpackChunkName: "story"*/'./Main.vue')
  }, {
    path: '/story/manage',
    component: () => import(/*webpackChunkName: "story"*/'./StoryManage.vue')
  }, {
    path: '/story/album/manage',
    component: () => import(/*webpackChunkName: "story"*/'./AlbumManage.vue')
  }],
  async onload (ctx) {
    ctx.storydao = new StoryDAO(ctx)
  }
}
