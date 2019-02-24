<template>
<div class="scene" :style="sceneStyle">
  <div v-for="(element, index) in scene.elements" :key="element.id" class="element-wrapper"
    @click="onElementClicked(index)"
    :style="element.computedStyle"
    :ref="'element-' + index"
    :class="[element.animationPreview, index===currentIndex?'current':'']">
    <div v-if="element.type === 'text'" class="text" :style="{
      fontSize: element.font
    }">
      {{element.content}}
    </div>
  </div>
</div>
</template>

<script>
import EditElement from './dialog/ConfigElement'
import utils from '../utils/util'
import positionUtils from '../utils/position'
import styleUtils from '../utils/styles'

export default {
  name: 'Scene',
  components: {
    EditElement
  },
  props: {
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
    }
  },
  computed: {
    sceneStyle () {
      return styleUtils.getSceneStyle(this.scene, this.device)
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
      currentIndex: -1
    }
  },
  methods: {
    renderElement (element) {
      this.$set(element, 'computedStyle', styleUtils.getElementStyle(element, this.device))
      // element.computedStyle = styleUtils.getElementStyle(element, this.device)
    },

    renderAllElements () {
      for (let element of this.scene.elements) {
        this.renderElement(element)
      }
    },

    onElementClicked (index) {
      this.currentIndex = index
      this.currentElement = this.scene.elements[index]
      this.$emit('element-selected', this.currentElement)
    },
    onSceneClicked () {
      this.currentIndex = -1
      this.currentElement = null
      this.$emit('scene-selected')
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
    &.current {
      border: 1px solid #4B946A;
    }
    .van-icon-setting-o {
      position: absolute;
      right: 4px;
      top: -28px;
      font-size: 24px;
      color: #666;
    }
    .image {
      display: flex;
      justify-content: center;
      box-sizing: border-box;
      align-items: center;
      color: #666;
      width: 100%;
      height: 100%;
      background-color: #efefef;
    }
  }
}
</style>
