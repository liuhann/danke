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
    path: '/creative/my',
    beforeEnter,
    component: () => import(/* webpackChunkName: "xd-center" */'./center/CreativeCenter.vue'),
    children: [{
      path: 'my',
      component: () => import(/* webpackChunkName: "xd-creative" */'./center/MyWork.vue'),
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
    component: () => import(/* webpackChunkName: "xd-center" */'./center/AddNew.vue')
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
    component: () => import(/* webpackChunkName: "manage" */'./center/WorkManage.vue')
  }, {
    path: '/vector/manage',
    component: () => import(/* webpackChunkName: "manage" */'./center/VectorPackManage.vue')
  }, {
    path: '/svg-path/maker',
    component: () => import(/* webpackChunkName: "manage" */'./clippath-maker/Container.vue')
  }],
  async onload (ctx) {
  }
}
