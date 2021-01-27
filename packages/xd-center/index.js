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
    path: '/xd/center',
    beforeEnter,
    component: () => import(/* webpackChunkName: "xd-center" */'./CreativeCenter.vue'),
    children: [{
      path: 'my',
      component: () => import(/* webpackChunkName: "xd-creative" */'../xd-center/MyWork.vue'),
    }, {
      path: 'profile',
      component: () => import(/* webpackChunkName: "xd-creative" */'../user/UserProfile.vue'),
    }]
  }, {
    path: '/user/profile',
    beforeEnter,
    component: () => import(/* webpackChunkName: "xd-center" */'../user/UserProfile.vue')
  }, {
    path: '/creative/new',
    beforeEnter,
    component: () => import(/* webpackChunkName: "xd-center" */'../xd-center/AddNew.vue')
  }],
  async onload (ctx) {
  }
}
