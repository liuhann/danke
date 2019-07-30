export default {
  routes: [{
    path: '/play/:mode/:id',
    component: () => import(/* webpackChunkName: "xd-welcome" */'./PagePlay.vue')
  }],
  async onload (ctx) {
  }
}
