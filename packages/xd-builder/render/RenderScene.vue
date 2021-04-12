<template>
  <div class="scene" :style="sceneStyle" @click="$emit('click')">
    <render-element v-for="element of scene.elements" :key="element.id"
                    :play="scene.play"
                    :variables="getElementVariable(element)"
                    :view-port="sceneViewPort"
                    :element="element"
                    :view-box="viewBox"
                    :seek="seek"
    />
  </div>
</template>

<script>
import { fitRectIntoBounds } from '../mixins/rectUtils'
import RenderElement from './RenderElement.vue'
/**
 * 渲染场景
 */
export default {
  name: 'RenderScene',
  components: { RenderElement },
  props: {
    variables: {
      type: Array,
      dafault: function () {
        return []
      }
    },
    seek: {
      type: Number
    },
    autoPlay: {
      type: Boolean
    },
    // 渲染阶段
    stage: {
      type: String
    },
    viewBox: {
      type: Object
    },
    // 场景内容
    scene: {
      type: Object
    },
    // 给出的显示区域大小
    viewPort: {
      type: Object
    }
  },
  data () {
    return {
      scale: 0.1,
      sceneViewPort: {
        width: 240,
        height: 160
      }
    }
  },
  computed: {
    sceneStyle () {
      const styles = {
        width: this.viewBox.width + 'px',
        height: this.viewBox.height + 'px'
        // transform: 'scale(' + this.scale + ')'
      }
      return styles
    },
  },
  mounted () {
    if (this.viewPort) {
      this.sceneViewPort = this.viewPort
    } else {
      const container = {
          width: this.$el.parentElement.clientWidth - 20,
          height: this.$el.parentElement.clientHeight - 20
        }
        this.sceneViewPort = fitRectIntoBounds(this.viewBox, container)
        //this.scale = this.sceneViewPort.width / this.viewBox
    }
  },
  methods: {
    getElementVariable (element) {
      if (this.variables) {
        return this.variables.filter(variable => variable.element === element.id)
      } else {
        return []
      }
    }
  }
}
</script>

<style lang="scss">
.scene {
  position: relative;
  transform-origin: top left;
  background: #fff;
}
</style>
