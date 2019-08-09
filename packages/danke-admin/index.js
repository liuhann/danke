const beforeEnter = (to, from, next) => {
  if (to.meta.ctx.user.id!=='15011245191') {
    next('/')
  } else {
    next()
  }
}

export default {
  routes: [{
    path: '/danke-admin',
    beforeEnter,
    component: () => import(/* webpackChunkName: "danke-admin" */'./DankeAdmin.vue')
  }],
  async onload (ctx) {
  }
}
