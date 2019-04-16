export default {
  routes: [{
    path: '/designer/:type?',
    component: () => import(/* webpackPrefetch: true; webpackChunkName: "designer" */ './Designer.vue')
  }]
}
