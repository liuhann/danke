export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!vm.ctx.user || !vm.ctx.user.id) {
        vm.ctx.toPath = to.path
        vm.$router.replace('/login')
      }
    })
  }
}
