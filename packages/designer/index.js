const Designer = () => import('./Designer.vue')
export default {
  routes: [{
    path: '/designer/:type?',
    component: Designer
  }]
}
