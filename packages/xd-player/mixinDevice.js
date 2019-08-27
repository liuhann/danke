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
  data () {
    return {
      device: {
        width: 100,
        height: 100
      },
      deviceStyle: {
        width: '100px',
        height: '100px'
      }
    }
  },
  mounted () {
    this.device = this.getDevice()
    this.deviceStyle = {
      width: this.device.width + 'px',
      height: this.device.height + 'px'
    }
  },
  methods: {
    getDevice () {
      if (this.deviceSet) {
        return this.deviceSet
      }
      if (this.height || this.width) {
        return fitBy(this.ratio, this.width, this.height)
      } else {
        return fitBy(this.ratio, this.$el.parentElement.clientWidth, this.$el.parentElement.clientHeight)
      }
    }
  }
}
