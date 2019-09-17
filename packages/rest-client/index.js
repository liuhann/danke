const beforeEnter = (to, from, next) => {
  if (false) {
    next('/')
  } else {
    next()
  }
}

export default {
  routes: [{
    path: '/rest/list',
    beforeEnter,
    component: () => import(/* webpackChunkName: "rest-list" */'./RestList.vue')
  }],
  async onload (ctx) {
  }
}
