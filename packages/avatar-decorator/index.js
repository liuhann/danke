// specific builder: Avatar Decorator
export default {
  routes: [{
    path: '/avatar',
    component: () => import(/* webpackChunkName: "avatar" */'./AvatarHome.vue')
  }, {
    path: '/avatar/preview',
    component: () => import(/* webpackChunkName: "avatar-preview" */'./AvatarPreview.vue')
  }]
}
