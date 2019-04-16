export default {
  routes: [{
    path: '/designer/:type?',
    component: () => import(/* webpackChunkName: "designer" */ './Designer.vue')
  }]
}
