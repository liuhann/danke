const beforeEnter = (to, from, next) => {
  next()
}
export default {
  routes: [{
    path: '/slide/lite',
    component: () => import(/* webpackChunkName: "slide-lite" */'./PageSlideLite.vue')
  }, {
    path: '/slide/lite/list',
    component: () => import(/* webpackChunkName: "slide-lite" */'./PageSlideLiteList.vue')
  }],
  async onload (ctx) {
  }
}
