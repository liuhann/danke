import './fontello/css/fontello.css'
export default {
  routes: [{
    path: '/builder/scene/:id?/:screen?',
    component: () => import(/* webpackChunkName: "tool" */'./PageTool.vue')
  }, {
    path: '/scenes',
    component: () => import(/* webpackChunkName: "tool" */'./PageList.vue')
  }],
  async onload (ctx) {

  }
}
