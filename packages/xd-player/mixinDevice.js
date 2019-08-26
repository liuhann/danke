import { fitBy } from '../danke-core/utils/common'

export default {
  props: {
    deviceSet: {
      type: Object
    },
    width: {
      type: Number
    },
    ratio: {
      type: String
    },
    height: {
      type: Number
    }
  },
  computed: {
    device () {
      if (this.deviceSet) {
        return this.deviceSet
      }
      if (this.height || this.width) {
        return fitBy(this.ratio, this.width, this.height)
      } else {
        return fitBy(this.ratio, this.$el.clientWidth, this.$el.clientHeight)
      }
    }
  }
}