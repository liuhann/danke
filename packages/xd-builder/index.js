import './fontello/css/fontello.css'
export default {
  routes: [{
    path: '/xd',
    beforeEnter: (to, from, next) => {
      // called before the route that renders this component is confirmed.
      // does NOT have access to `this` component instance,
      // because it has not been created yet when this guard is called!
      if (!to.meta.ctx.user.id) {
        to.meta.ctx.toPath = '/xd'
        next('/login')
      } else {
        next()
      }
    },
    component: () => import(/* webpackChunkName: "xd" */'./Builder.vue')
  }],
  async onload (ctx) {

  }
}
