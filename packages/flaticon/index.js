export default {
  routes: [{
    path: '/flaticon',
    component: () => import(/* webpackChunkName: "flat-icon" */'./FlatIconManage.vue')
  }],
  async onload (ctx) {
  }
}
