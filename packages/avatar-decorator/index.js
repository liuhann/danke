// specific builder: Avatar Decorator
export default {
  routes: [{
    path: '/avatar',
    component: () => import(/* webpackChunkName: "avatar" */'./Avatar.vue')
  }]
}
