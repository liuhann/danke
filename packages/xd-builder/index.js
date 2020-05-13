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
    path: '/creative',
    beforeEnter,
    component: () => import(/* webpackChunkName: "xd-creative" */'./center/CreativeCenter.vue'),
    children: [{
      path: 'my',
      component: () => import(/* webpackChunkName: "xd-creative" */'./center/MyWork.vue'),
    }, {
      path: 'new',
      component: () => import(/* webpackChunkName: "xd-creative" */'./center/AddNew.vue'),
    }, {
      path: 'vectors',
      component: () => import(/* webpackChunkName: "xd-creative" */'./center/MyVectorPacks.vue'),
    }, {
      path: 'blocks',
      component: () => import(/* webpackChunkName: "xd-creative" */'./center/MyBlocks.vue'),
    }, {
      path: 'images',
      component: () => import(/* webpackChunkName: "xd-creative" */'./center/MyImagePacks.vue'),
    }, {
      path: 'pack/:id',
      component: () => import(/* webpackChunkName: "xd-creative" */'./center/PackDetail.vue'),
    }, {
      path: 'svg/edit',
      component: () => import(/* webpackChunkName: "res-edit" */'./center/PageSVGEdit.vue'),
    }, {
      path: 'profile',
      component: () => import(/* webpackChunkName: "xd-creative" */'../user/UserProfile.vue'),
    }]
  }, {
    path: '/xd',
    beforeEnter,
    component: () => import(/* webpackChunkName: "xd" */'./Builder.vue')
  }, {
    path: '/slide/:work',
    component: () => import(/* webpackChunkName: "preview" */'./preview/SlidePreview.vue')
  }, {
    path: '/work/manage',
    component: () => import(/* webpackChunkName: "preview" */'./center/WorkManage.vue')
  }],
  async onload (ctx) {
  }
}
