import './fontello/css/fontello.css'
export default {
  routes: [{
    path: '/page-tool/:id?/:screen?',
    component: () => import(/* webpackChunkName: "tool" */'./PageTool.vue')
  }, {
    path: '/page-list',
    component: () => import(/* webpackChunkName: "tool" */'./PageList.vue')
  }],
  async onload (ctx) {

  }
}
