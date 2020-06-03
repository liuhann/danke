<template>
<div class="scene" :style="sceneStyle" :class="sceneClass">
  <render-element v-for="element of scene.elements" :view-port="viewPort"  :key="element.id" :element="element" :view-box="viewBox" :stage="stage">
  </render-element>
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
        zIndex: this.scene.z
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
  }
}
</script>

<style lang="scss" scoped>
.scene {
  position: relative;
}
</style>
