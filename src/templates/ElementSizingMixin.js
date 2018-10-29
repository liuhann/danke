export default {
  data () {
    return {
      grid: {
        width: 0,
        height: 0
      }
    }
  },

  created () {
    this.grid.width = this.engine.gridCfg.width
    this.grid.height = this.engine.gridCfg.height
  },

  methods: {
    getElementSizingStyle (element) {
      const style = {
        position: 'absolute',
        left: element.left * this.grid.width + 'px',
        top: element.top * this.grid.height + 'px',
        width: element.width * this.grid.width + 'px'
      }
      if (element.shape === 'circle' || element.shape === 'square') {
        style.height = style.width
      } else if (element.height) {
        style.height = element.height * this.grid.height + 'px'
      }
      if (element.clipPath) {
        style.clipPath = element.clipPath
      }
      return style
    }
  }
}
