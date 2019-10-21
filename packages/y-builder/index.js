const beforeEnter = (to, from, next) => {
  if (!to.meta.ctx.user.id) {
    to.meta.ctx.toPath = to.path
    next('/login')
  } else {
    next()
  }
}
export default {
  routes: [{
    path: '/yd',
    beforeEnter,
    component: () => import(/* webpackChunkName: "yd" */'./YBuilder.vue')
  }],
  async onload (ctx) {
  }
}
