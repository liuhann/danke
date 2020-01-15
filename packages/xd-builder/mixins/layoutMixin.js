/**
 * 场景绘制区大小、缩放相关控制
 */
import { fitToContainer } from '../../danke-core/utils/common'
import { getBackgroundStyle } from '../../danke-core/css-model/background'

export default {
  data () {
    return {
      zoom: 1,
      devicePadding: [5, 5]
    }
  },
  computed: {
    device () {
      return {
        width: this.work.screen.width * this.zoom,
        height: this.work.screen.height * this.zoom
      }
    },
    deviceStyle () {
      const styles = [`width: ${this.device.width}px`,
        `height: ${this.device.height}px`]
      if (this.work.background && this.work.background.colors.length) {
        styles.push(getBackgroundStyle(this.work))
      } else {
        styles.push(`background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==")`)
      }
      return styles.join(';')
    }
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
      const containerEl = this.$refs.sceneContainer
      if (this.ratio) {
        const paddings = this.devicePadding
        this.zoom = 1
      }
      this.$nextTick(() => {
        let x = (containerEl.clientWidth - paddings[0] * 2 - this.deviceOrigin.width) / 2
        let y = 0
        this.$refs.device.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
        // intereactWith(this.$refs.deviceDrag || this.$refs.device, this.$refs.device)
      })
    }
  }
}
