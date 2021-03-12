const beforeEnter = (to, from, next) => {
  // called before the route that renders this component is confirmed.
  // does NOT have access to `this` component instance,
  // because it has not been created yet when this guard is called!
  if (!to.meta.ctx.user.id) {
    to.meta.ctx.toPath = to.path
    next('/login')
  } else {
    next()
  }
}
export default {
  routes: [{
    path: '/xd-lite',
    beforeEnter,
    component: () => import(/* webpackChunkName: "lite" */'./Lite.vue')
  }],
  async onload (ctx) {
  }
}
