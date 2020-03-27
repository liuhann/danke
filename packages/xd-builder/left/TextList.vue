<template>
<div class="left-text-template">
  <div class="hint">拖拽文字到设计区</div>
  <div class="basic">
    <div class="title-1" draggable @dragstart="dragStart(fontTemplates[0], $event)" @dragend="dragEnd">添加标题</div>
    <div class="subtitle-1" draggable @dragstart="dragStart(fontTemplates[2], $event)" @dragend="dragEnd">添加标题描述</div>
    <div class="title-2" draggable @dragstart="dragStart(fontTemplates[1], $event)" @dragend="dragEnd">添加子标题</div>
    <div class="subtitle-2" draggable @dragstart="dragStart(fontTemplates[3], $event)" @dragend="dragEnd">添加子描述</div>
    <div class="content" draggable @dragstart="dragStart(fontTemplates[4], $event)" @dragend="dragEnd">添加正文</div>
  </div>
</div>
</template>
<script>

const fontStyles = {
  fontSize: 'var(--fontSize)',
  color: 'var(--color)',
  textAlign: 'var(--textAlign)',
  fontWeight: 'var(--fontWeight)'
}
const fontTemplates = [{
  text: '添加标题',
  style: fontStyles,
  variables: [{
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
    name: 'fontSize',
    value: 14,
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
