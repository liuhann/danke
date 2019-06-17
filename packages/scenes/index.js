import './fontello/css/fontello.css'
export default {
  routes: [{
    path: '/scene/:id?/:screen?',
    component: () => import(/* webpackChunkName: "tool" */'./PageSceneBuilder.vue')
  }, {
    path: '/scenes',
    component: () => import(/* webpackChunkName: "tool" */'./PageSceneList.vue')
  }],
  async onload (ctx) {

  }
}
