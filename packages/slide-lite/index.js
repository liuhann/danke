const beforeEnter = (to, from, next) => {
  next()
}
export default {
  routes: [{
    path: '/slide/lite',
    component: () => import(/* webpackChunkName: "slide-lite" */'./PageSlideLite.vue')
  }],
  async onload (ctx) {
  }
}
