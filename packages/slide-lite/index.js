// 轻量应用 已弃用
const beforeEnter = (to, from, next) => {
  if (!to.meta.ctx.user.id) {
    to.meta.ctx.toPath = to.path
    next('/login')
  } else {
    next()
  }
  next()
}
export default {
  routes: [{
    path: '/slide/lite',
    beforeEnter,
    component: () => import(/* webpackChunkName: "slide-lite" */'./PageSlideLite.vue')
  }, {
    path: '/slide/lite/list',
    beforeEnter,
    component: () => import(/* webpackChunkName: "slide-lite" */'./PageSlideLiteList.vue')
  }],
  async onload (ctx) {
  }
}
