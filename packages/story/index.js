export default {
  routes: [{
    path: '/story',
    component: () => import(/*webpackChunkName: "story"*/'./Main.vue')
  }]
}
