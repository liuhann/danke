import './fontello/css/fontello.css'
export default {
  routes: [{
    path: '/xd',
    component: () => import(/* webpackChunkName: "xd" */'./Builder.vue')
  }],
  async onload (ctx) {

  }
}
