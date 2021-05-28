<template>
  <div class="scene" :style="sceneStyle" @click="$emit('click')">
    <render-element v-for="element of scene.elements" :key="element.id"
                    :play="scene.play"
                    :variables="getElementVariable(element)"
                    :view-port="sceneViewPort"
                    :view-box="viewBox"
                    :element="element"
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
      scale: 1,
      sceneViewPort: {
        width: 240,
        height: 160
      }
    }
  },
  computed: {
    sceneStyle () {
      const styles = {
        width: this.sceneViewPort.width + 'px',
        height: this.sceneViewPort.height + 'px'
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
        const sceneViewPort = fitRectIntoBounds(this.viewBox, container)
        this.sceneViewPort = sceneViewPort
        this.scale = sceneViewPort.width / this.viewBox.width
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
  background: transparent;
}
</style>

