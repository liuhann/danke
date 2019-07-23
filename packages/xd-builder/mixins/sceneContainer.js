import { intereactWith } from '../utils/interact'
import { TypeEnum } from '../../danke-core/elements'
import { fitToContainer } from '../../danke-core/utils/common'

export default {
  data () {
    return {
      zoom: 1,
      deviceOrigin: {
        width: 360,
        height: 640
      }
    }
  },
  provide () {
    return {
      zoom: this.zoom
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
  },
  destroyed () {
  },
  methods: {
    initSceneContainer () {
      intereactWith(this.$refs.deviceDrag, this.$refs.device)
      this.zoomCenter()
    },
    contentChange (e) {
      this.editedText = e.target.innerHTML.replace(/<br>/g, '\n')
    },
    choose (element, e) {
      if (this.currentElement && this.currentElement.type === TypeEnum.TEXT && this.editedText) {
        this.currentElement.text = this.editedText
        this.editedText = null
      }
      if (this.currentElement && this.currentElement.type === TypeEnum.TEXT && this.currentElement.text === '') {
        this.currentElement.text = ' '
      }
      this.chooseElement(element, e)
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
      debugger
      const containerEl = this.$refs.sceneContainer
      const paddings = [20, 20]
      this.zoom = 1
      this.deviceOrigin = fitToContainer(this.work.ratio, containerEl.clientWidth - paddings[0] * 2, containerEl.clientHeight - paddings[1] * 2)
      this.$nextTick(() => {
        let x = (containerEl.clientWidth - paddings[0] * 2 - this.deviceOrigin.width) / 2
        let y = paddings[1]
        this.$refs.device.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
      })
    }
  }
}