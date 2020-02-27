const beforeEnter = (to, from, next) => {
  // called before the route that renders this component is confirmed.
  // does NOT have access to `this` component instance,
  // because it has not been created yet when this guard is called!
  if (!to.meta.ctx.user.id) {
    to.meta.ctx.toPath = to.path
    next('/login')
  } else {
    document.getElementById('footer').style.display = 'none'
    next()
  }
}
export default {
  routes: [{
    path: '/xd/welcome',
    beforeEnter,
    component: () => import(/* webpackChunkName: "xd-welcome" */'./Welcome.vue')
  }, {
    path: '/xd',
    beforeEnter,
    component: () => import(/* webpackChunkName: "xd" */'./Builder.vue')
  }, {
    path: '/review',
    component: () => import(/* webpackChunkName: "preview" */'./Preview.vue')
  }],
  async onload (ctx) {
  }
}
