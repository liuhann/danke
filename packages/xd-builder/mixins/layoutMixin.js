/**
 * 场景绘制区大小、缩放相关控制
 */
import { fitToContainer } from '../../danke-core/utils/common'

export default {
  data () {
    return {
      zoom: 1,
      deviceOrigin: {
        width: 360,
        height: 640
      },
      devicePadding: [0, 0]
    }
  },
  provide () {
    return {
      device: this.device,
      zoom: this.zoom,
      zoomIn: this.zoomIn,
      zoomOut: this.zoomOut,
      zoomCenter: this.zoomCenter,
      setLeftToggleShow: this.setLeftToggleShow
    }
  },
  computed: {
    device () {
      return {
        width: this.deviceOrigin.width * this.zoom,
        height: this.deviceOrigin.height * this.zoom
      }
    },
    deviceStyle () {
      return {
        width: this.device.width + 'px',
        height: this.device.height + 'px'
      }
    }
  },
  mounted () {
    this.zoomCenter()
  },
  methods: {
    initSceneContainer () {
      this.zoomCenter()
    },
    zoomIn () {
      this.zoom = Math.floor((this.zoom - 0.02) * 100) / 100
      this.reflow(this.scenes)
    },
    zoomOut () {
      this.zoom = Math.floor((this.zoom + 0.02) * 100) / 100
      this.reflow(this.scenes)
    },
    zoomCenter () {
      const ratio = this.ratio || this.$route.query.ratio || '9:16'
      const containerEl = this.$refs.sceneContainer
      const paddings = this.devicePadding
      this.zoom = 1
      this.deviceOrigin = fitToContainer(ratio, containerEl.clientWidth - paddings[0] * 2, containerEl.clientHeight - paddings[1] * 2)
      this.$nextTick(() => {
        let x = (containerEl.clientWidth - paddings[0] * 2 - this.deviceOrigin.width) / 2
        let y = 0
        this.$refs.device.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
        // intereactWith(this.$refs.deviceDrag || this.$refs.device, this.$refs.device)
      })
    }
  }
}
