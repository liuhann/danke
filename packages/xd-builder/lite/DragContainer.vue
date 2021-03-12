<template>
  <div id="drag-container">
    <div id="workspace">
      <!-- 当前屏幕内容 -->
      <div class="screen" :style="styleScreen">
        <div v-if="scene" class="scene" :style="sceneStyle">
          <render-element
            v-for="(element, index) of scene.elements"
            :key="element.id"
            :ref="element.id"
            :stage="element.stage"
            :element="element"
            :view-box="viewBox"
            :view-port="viewPort"
            :index="index"
          />
        </div>
      </div>
      <!-- 元素被选中、移动、调整大小时的选中层 -->
      <div v-if="scene" class="mask" :style="styleMask">
        <div
          v-for="selectee in scene.elements"
          :id="'mask-' + selectee.id"
          :key="selectee.id"
          class="node-mask"
          :class="getMaskClass(selectee)"
          :style="getMaskStyle(selectee)"
        >
          <template v-if="!selectee.locked">
            <div class="lt resize-l resize-t" /><div class="rt resize-r resize-t" /><div class="t resize-t" /><div class="l resize-l" /><div class="lb resize-l resize-b" /><div class="rb resize-b resize-r" /><div class="r resize-r" /><div class="b resize-b" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import workListMixins from '../mixins/workListMixins'
export default {
  name: "DragContainer",
  mixins: [ workListMixins ],

  computed: {
    styleScreen () {
      const screenStyle = {
        width: this.viewPort.width + 'px',
        height: this.viewPort.height + 'px',
        background: this.work.color,
        transition: 'transform .2s ease-out'
      }
      return screenStyle
    },
  }
}
</script>

<style scoped>

</style>