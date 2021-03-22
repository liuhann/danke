// Web首页 主站
export default {
  routes: [{
    path: '/',
    component: () => import(/*webpackChunkName: "site" */'./Main.vue'),
    children: [{
      path: 'site/label-anime',
      component: () => import(/*webpackChunkName: "site" */'./SiteLabelAnim.vue')
    }]
  }, {
   
  }],
  async onload (ctx) {
    console.log('entering site')
  }
}
