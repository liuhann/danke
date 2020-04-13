<template>
<div class="left-text-template">
  <div class="hint">拖拽文字到设计区</div>
  <div class="basic">
    <div v-for="(template, index) in fontTemplates" :style="fontStyle(template)" draggable :key="index" @dragstart="dragStart(template, $event)" @dragend="dragEnd">{{template.text}}</div>
  </div>
</div>
</template>
<script>

import { assignVariables } from '../mixins/renderUtils'
import { fontTemplates } from './texts'

export default {
  name: 'TextList',
  data () {
    return {
      dragging: false,
      fontTemplates
    }
  },
  methods: {
    dragStart (element, ev) {
      // stringify image info as text
      ev.dataTransfer.setData('Text', JSON.stringify(element))
      this.dragging = true
    },

    fontStyle (template) {
      const style = {}
      Object.assign(style, template.style)
      assignVariables(style, template.variables)
      style.color = '#fff'
      style.textAlign = 'left'
      return style
    },

    dragEnd () {
      this.dragging = false
    }
  }
}
</script>

<style lang="scss">
.left-text-template {
  .hint {
    margin: 10px 0;
    color: hsla(0,0%,100%,.5);
  }
  .basic>div {
    background: hsla(0,0%,100%,.07);
    border-radius: 4px;
    margin-bottom: 8px;
    color: #fff;
    padding: 10px 15px;
    cursor: move;
  }

  .basic {
    .title-1 {
      font-weight: 400;
      font-size: 28px;
    }
    .title-2 {
      font-weight: 400;
      font-size: 24px;
    }
    .subtitle-1 {
      font-weight: 200;
      font-size: 18px;
    }
    .subtitle-2 {
      font-weight: 200;
      font-size: 16px;
    }
    .content {
      font-size: 14px;
    }
  }
}
</style>
