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
const fontTemplates = [{
  text: '添加标题',
  style: {
    fontSize: '48px',
    color: '#333',
    fontWeight: 800,
    letterSpacing: 4
  }
}, {
  text: '添加标题描述',
  style: {
    fontSize: '24px',
    color: '#666',
    fontWeight: 400,
    letterSpacing: 4
  }
}, {
  text: '添加子标题',
  style: {
    fontSize: '36px',
    color: '#333',
    fontWeight: 400,
    letterSpacing: 4
  }
}, {
  text: '添加子描述',
  style: {
    fontSize: '20px',
    color: '#000',
    fontWeight: 200,
    letterSpacing: 4
  }
}, {
  text: '添加正文',
  style: {
    fontSize: '14px',
    color: '#000',
    fontWeight: 200,
    letterSpacing: 4
  }
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
