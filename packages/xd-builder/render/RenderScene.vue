<template>
  <div class="scene" :style="sceneStyle" :class="sceneClass" @click="$emit('click')">
    <render-element v-for="element of scene.elements" :key="element.id"
                    :autoplay="autoPlay"
                    :variables="getElementVariable(element)"
                    :view-port="viewPort"
                    :element="element"
                    :view-box="viewBox"
                    :seek-play="seek"
                    :stage="scene.stage"
    />
  </div>
</template>

<script>
import RenderElement from './RenderElement'
/**
 * 渲染场景
 */
export default {
  name: 'RenderScene',
  components: { RenderElement },
  props: {
    scale: {
      type: Number,
      default: 1
    },
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
    // 渲染阶段 可以为进入、离开2个
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
  computed: {
    sceneClass () {
      const classes = []
      for (let key in this.scene.style) {
        if (this.scene.style[key] && this.scene.style[key].name) {
          classes.push(this.scene.style[key].name)
        }
      }
      return classes
    },
    sceneStyle () {
      const styles = {
        width: this.viewPort.width + 'px',
        height: this.viewPort.height + 'px',
        zIndex: this.scene.z,
        transform: 'scale(' + this.scale + ')',
        backgroundColor: this.scene.color
      }
      for (let key in this.scene.style) {
        if (this.scene.style[key] && !this.scene.style[key].name) {
          Object.assign(styles, {
            [key]: this.scene.style[key]
          })
        }
      }
      return styles
    },
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
}
</style>
