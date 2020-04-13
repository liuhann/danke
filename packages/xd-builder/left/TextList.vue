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

const fontStyles = {
  fontSize: 'var(--fontSize)',
  color: 'var(--color)',
  textAlign: 'var(--textAlign)',
  fontFamily: 'var(--fontFamily)',
  fontWeight: 'var(--fontWeight)'
}
const fontTemplates = [{
  text: '添加标题',
  style: fontStyles,
  variables: [{
    name: 'fontFamily',
    value: '微软雅黑',
    type: 'fontFamily'
  }, {
    name: 'fontSize',
    value: 48,
    type: 'fontSize'
  }, {
    name: 'color',
    value: '#444',
    type: 'color'
  }, {
    name: 'textAlign',
    value: 'center',
    type: 'textAlign'
  }, {
    name: 'fontWeight',
    value: 800,
    type: 'fontWeight'
  }]
}, {
  text: '添加子标题',
  style: fontStyles,
  variables: [{
    name: 'fontFamily',
    value: '微软雅黑',
    type: 'fontFamily'
  }, {
    name: 'fontSize',
    value: 36,
    type: 'fontSize'
  }, {
    name: 'color',
    value: '#333',
    type: 'color'
  }, {
    name: 'textAlign',
    value: 'center',
    type: 'textAlign'
  }, {
    name: 'fontWeight',
    value: 400,
    type: 'fontWeight'
  }]
}, {
  text: '添加正文',
  style: fontStyles,
  variables: [{
    name: 'fontFamily',
    value: '微软雅黑',
    type: 'fontFamily'
  }, {
    name: 'fontSize',
    value: 24,
    type: 'fontSize'
  }, {
    name: 'color',
    value: '#333',
    type: 'color'
  }, {
    name: 'textAlign',
    value: 'left',
    type: 'textAlign'
  }, {
    name: 'fontWeight',
    value: 200,
    type: 'fontWeight'
  }]
}]

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
