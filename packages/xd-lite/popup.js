export default {
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      show: false
    }
  },
  watch: {
    value () {
      this.show = this.value
    }
  }
}
