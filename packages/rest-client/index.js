const beforeEnter = (to, from, next) => {
  if (to.meta.ctx.user.id!=='15011245191') {
    next('/')
  } else {
    next()
  }
}
window.ResizeObserver = undefined
export default {
  routes: [{
    path: '/rest/list',
    component: () => import(/* webpackChunkName: "rest-ctrl" */'./RestList.vue')
  }],
  async onload (ctx) {
  }
}
