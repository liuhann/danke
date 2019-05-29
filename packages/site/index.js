export default {
  routes: [{
    path: '/',
    component: () => import(/*webpackChunkName: "site" */'./Main.vue')
  }],
  async onload (ctx) {

    console.log('entering site')
  }
}
