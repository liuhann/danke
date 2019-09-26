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
    /**
     * 处理逻辑
     * 1 首选 deviceSet设置
     * 2 如果设置了宽度或者高度， 就按ratio计算
     * 3 宽度与高度都没设置， 就按容器 宽、高+ratio计算 都提供的话适应小的 如果定宽或者定高需要设置另一项为0
     * 容器不能有padding  如果有就再嵌套一层容器
     */
    getDevice () {
      if (this.deviceSet) {
        return this.deviceSet
      }
      if (this.height || this.width) {
        return fitBy(this.ratio, this.width, this.height)
      } else {
        return fitBy(this.ratio, this.width === 0 ? 0 : this.$el.parentElement.clientWidth,
          this.height === 0 ? 0 : this.$el.parentElement.clientHeight)
      }
    }
  }
}
