export default {
  data () {
    return {
      user: this.ctx.user
    }
  },
  computed: {
    avatar () {
      if (this.user && this.user.id) {
        return this.user.avatar || this.ctx.cdn + '/res/user.png'
      } else {
        return null
      }
    },
    userid () {
      return this.user && this.user.id
    }
  }

}
