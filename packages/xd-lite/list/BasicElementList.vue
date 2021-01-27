<!--所有内置HTML类型元素列表-->
<template>
  <div class="basic-element-list">
    <van-grid :border="false" :column-num="4" square>
      <van-grid-item v-for="(element, index) of elements" :key="index" @click="onElementClick(element)">
        <div class="element-content" :style="elementStyle(element)">
          <div v-if="element.text" class="text">
            {{ element.text }}
          </div>
        </div>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import * as  basicElements from '../../xd-builder/templates.js'
import { elementStyle } from '../../xd-builder/utils/sceneActions.js'

export default {
  name: "BasicElementList",
  data () {
    return {
      elements: basicElements
    }
  },
  methods: {
    onElementClick (element) {
      this.$emit('select', JSON.parse(JSON.stringify(element)))
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
  .van-grid-item__content {
   padding: 8px;
  }
  .text {
    text-align: center;
  }
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
