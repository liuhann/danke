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
    path: '/user/profile',
    beforeEnter,
    component: () => import(/* webpackChunkName: "xd-center" */'../user/UserProfile.vue')
  }, {
    path: '/creative/new',
    beforeEnter,
    component: () => import(/* webpackChunkName: "xd-center" */'../xd-center/AddNew.vue')
  }, {
    path: '/xd',
    beforeEnter,
    component: () => import(/* webpackChunkName: "xd" */'./Builder.vue')
  }, {
    path: '/slide/:work',
    component: () => import(/* webpackChunkName: "preview" */'./preview/SlidePreview.vue')
  }, {
    path: '/work/snapshot/:id',
    component: () => import(/* webpackChunkName: "preview" */'./preview/SnapShotPreview.vue')
  }, {
    path: '/work/manage',
    component: () => import(/* webpackChunkName: "manage" */'../xd-center/WorkManage.vue')
  }, {
    path: '/svg-path/maker',
    component: () => import(/* webpackChunkName: "manage" */'./clippath-maker/Container.vue')
  }],
  async onload (ctx) {
  }
}
