<template>
  <div class="basic-element-list">
    <div v-for="(element, index) of elements" :key="index" class="element-wrapper" :style="photoStyle" @click="onElementClick(element)">
      <div class="element-content" :style="elementStyle(element)">
        <div v-if="element.text" class="text">
          {{ element.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { assignVariables } from '../../xd-builder/mixins/renderUtils.js'
import * as  basicElements from '../../xd-builder/templates.js'
import { elementStyle } from '../../xd-builder/utils/sceneActions.js'

// const basicElements = [title, title2, text, rect, circle]

export default {
  name: "BasicElementList",
  data () {
    return {
      gridWidth: 120,
      elements: basicElements
    }
  },
  computed: {
    photoStyle () {
      return {
        width: this.gridWidth + 'px',
        height: this.gridWidth + 'px'
      }
    }
  },
  mounted() {
    this.gridWidth = window.screen.availWidth / 4
  },
  methods: {
    onElementClick (element) {
      this.$emit('insert', element)
    },
    elementStyle (element) {
      const style = elementStyle(element)
      if (element.text) {
        delete style.fontSize
        delete style.lineHeight
      } else {
        style.width = '60%'
        style.height = '60%'
      }
      return style
    }
  }
}
</script>

<style lang="scss">
.basic-element-list {
  height: 254px;
  overflow-y: auto;
  .element-wrapper {
    float: left;
    padding: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    .element-content {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
  }
}

</style>