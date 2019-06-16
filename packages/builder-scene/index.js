import './fontello/css/fontello.css'
export default {
  routes: [{
    path: '/builder/scene/:id?/:screen?',
    component: () => import(/* webpackChunkName: "tool" */'./PageTool.vue')
  }, {
    path: '/scenes',
    component: () => import(/* webpackChunkName: "tool" */'./PageSceneList.vue')
  }],
  async onload (ctx) {

  }
}
