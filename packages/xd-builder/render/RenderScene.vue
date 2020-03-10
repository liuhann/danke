<template>
<div class="scene" :style="sceneStyle">
  <render-element v-for="element of scene.elements" :work-screen="work.screen"  :key="element.id" :element="element" :screen="viewport" :stage="stage">
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
    work: {
      type: Object
    },
    // 场景内容
    scene: {
      type: Object
    },
    // 给出的显示区域大小
    viewport: {
      type: Object
    }
  },
  computed: {
    sceneStyle () {
      const styles = {
        width: this.viewport.width + 'px',
        height: this.viewport.height + 'px'
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

<style lang="scss">
.scene {
  position: relative;
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
