// specific builder: Avatar Decorator
import user from '../user/index'

export default {
  routes: [{
    path: '/avatar',
    beforeEnter: user.checkLogin,
    component: () => import(/* webpackChunkName: "avatar" */'./AvatarHome.vue')
  }]
}
