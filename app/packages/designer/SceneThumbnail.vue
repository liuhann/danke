<template>
<div class="scene-thumbnail" :style="sceneStyle">
  <div v-for="(element, index) in sceneConfig.elements" :key="index" class="element-wrapper"  :class="[currentIndex===index?'selected':'']" :style="element.thumbnailStyle">
    <div v-if="element.type==='image'" class="image" :style="{
      backgroundImage: element.src
    }">
    </div>
    <div v-if="element.type === 'circle'" class="circle">
    </div>
  </div>
</div>
</template>

<script>
import styleUtils from '../utils/styles'

export default {
  name: 'SceneThumbnail',
  components: {
  },
  props: {
    scene: {
      type: Object
    },
    device: {
      type: Object
    }
  },

  watch: {
  },
  computed: {
    sceneStyle () {
      return {
        width: this.device.width + 'px',
        height: this.device.height + 'px'
      }
    },
    sceneConfig () {
      for (let i = 0; i < this.scene.elements.length; i++) {
        this.scene.elements[i].thumbnailStyle = styleUtils.getElementStyle(this.scene.elements[i], this.device)
      }
      return this.scene
    }
  },

  created () {

  },

  data () {
    return {
      currentElement: null,
      currentIndex: -1
    }
  },
  methods: {
    computeSceneStyle () {
      return utils.generateSceneDisplayStyle(this.scene, this.device, this.coordinate)
    },
    onElementClicked (index) {
      this.currentIndex = index
      // this.$emit('element-selected', index)
      this.currentElement = this.scene.elements[index]
    }
  }
}
</script>

<style lang="less">
.scene-thumbnail {
  position: relative;
  .element-wrapper {
    position: absolute;
    box-sizing: border-box;
    &.selected {
      border: 1px solid #4B946A;
    }
    .image {
      width: 100%;
      height: 100%;
      background-color: #E4E4E4;
    }
  }
}
</style>
