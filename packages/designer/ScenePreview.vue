<template>
<div class="scene" :style="sceneStyle">
  <div v-for="(element, index) in scene.elements" :key="element.id" class="element-wrapper"
    @click="onElementClicked(index)" @touchstart="touchStart(index, $event)" @touchmove="touchMove"
    :style="element.computedStyle"
    :ref="'element-' + index"
    :class="[element.animationPreview, index===currentIndex?'current':'']">
    <div v-if="element.type === 'text'" class="text" :style="{
      fontSize: element.font
    }" v-html="element.content ? (element.content.replace(/\n/g, '<br>')): ''">
    </div>
  </div>
</div>
</template>

<script>
import { getElementStyle } from '../style-editor/utils/styles'

export default {
  name: 'Scene',
  components: {
  },
  props: {
    element: {
      type: Object
    },
    scene: {
      type: Object
    },
    device: {
      type: Object
    },
    styleName: {
      type: String
    }
  },

  watch: {
    'currentElement': {
      deep: true,
      handler () {
        this.renderElement(this.currentElement)
      }
    },
    'currentElementLength': function(newVal, oldVal) {
      this.renderAllElements()
    },
    'scene': function() {
      this.renderAllElements()
    },
    'element': function (val) {
      if (val) {
        this.currentElement = val
        this.renderElement(this.currentElement)
      }
    }
  },
  computed: {
    sceneStyle () {
      return {
        width: this.device.width + 'px',
        height: this.device.height + 'px'
      }
    },
    currentElementLength () {
      return this.scene.elements.length
    }
  },

  created () {
    this.renderAllElements()
  },

  data () {
    return {
      currentElement: null,
      currentIndex: -1,
      touchedIndex: 0,
      lastTouchMoveX: 0,
      lastTouchMoveY: 0
    }
  },
  methods: {
    renderElement (element) {
      this.$set(element, 'computedStyle', getElementStyle(element, this.device))
      // element.computedStyle = styleUtils.getElementStyle(element, this.device)
    },

    touchStart (index, event) {
      this.touchedIndex = index
      this.lastTouchMoveX = event.touches[0].clientX
      this.lastTouchMoveY = event.touches[0].clientY
    },

    touchMove (e) {
      const deltaX = e.touches[0].clientX - this.lastTouchMoveX
      const deltaY = e.touches[0].clientY - this.lastTouchMoveY

      const movingElement = this.scene.elements[this.touchedIndex]
      let { bmx, bmy } = this.movePosition(movingElement.position, { deltaX, deltaY})

      if (bmx || bmy) {
        this.renderElement(movingElement)
      }

      if (bmx) {
        this.lastTouchMoveX = e.touches[0].clientX
      }
      if (bmy) {
        this.lastTouchMoveY = e.touches[0].clientY
      }
    },

    movePosition (position, {deltaX, deltaY}) {
      let bmx = this.isMoved(position, 'offsetX', deltaX)
      let bmy = this.isMoved(position, 'offsetY', deltaY)
      return {
        bmx, bmy
      }
    },
    isMoved: function (position, offsetX, delta) {
      let isMoved = true
      const minx = this.device.width / 100
      const miny = this.device.height / 100
      let direction = true

      if (offsetX === 'offsetX' && position.horizontal === 'right') {
        direction = false
      }
      if (offsetX === 'offsetY' && position.vertical === 'bottom') {
        direction = false
      }
      const {len, unit} = styleUtils.getLenSplits(position[offsetX])
      if (unit === 'vw' && Math.abs(delta) > minx) {
        let deltavw = Math.floor(delta / minx)
        if (!direction) {
          deltavw = - deltavw
        }
        position[offsetX] = (len + deltavw) + unit
      } else if (unit === 'vh' && Math.abs(delta) > miny) {
        let deltavh = Math.floor(delta / miny)
        if (!direction) {
          deltavh = - deltavh
        }
        position[offsetX] = (len + deltavh) + unit
      } else if (unit === 'px' && Math.floor(delta) > 1) {
        if (!direction) {
          delta = - delta
        }
        position[offsetX] = (len + delta) + unit
      } else {
        isMoved = false
      }
      return isMoved
    },
    renderAllElements () {
      for (let element of this.scene.elements) {
        this.renderElement(element)
      }
    },

    onElementClicked (index) {
      this.currentIndex = index
      this.currentElement = this.scene.elements[index]
      this.$emit('element-selected', index)
    }
  }
}
</script>

<style lang="less">
.scene {
  position: relative;
  .element-wrapper {
    position: absolute;
    box-sizing: border-box;
  }
}
</style>
