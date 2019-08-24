<template>
<div class="top-bar is-clearfix">
  <div class="flex-1">
    <a class="button is-white icon-menu" @click="setLeftToggleShow"></a>
  </div>
  <div class="right-buttons">
    <a class="button is-white is-small" @click="zoomIn">
      <i class="icon-minus-1"></i>
    </a>
    <span style="line-height: 38px;">{{Math.round($parent.zoom * 100)}}%</span>
    <a class="button is-white is-small" @click="zoomOut">
      <i class="icon-plus-1"></i>
    </a>
    <a class="button is-small" @click="runWork">
      预览
    </a>
    <a class="button is-success is-rounded is-small button-share" @click="publishShareWork">发布</a>
  </div>
</div>
</template>
<script>
import { Dialog } from 'element-ui'
export default {
  name: 'TopBar',
  components: {
    Dialog
  },
  data () {
    return {
      isEditName: false
    }
  },
  inject: ['zoomIn', 'zoomOut', 'runWork', 'zoom', 'setLeftToggleShow', 'publishShareWork'],
  methods: {
  }
}
</script>
<style lang="scss">
#xd {
  .top-bar {
    height: 38px;
    display: flex;
    background-color: #fff;
    .align-right {
      text-align: right;
    }
    .right-buttons {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .flex-1 {
      flex: 1;
    }
    .button-share {
      margin: .25em 1em;
    }
  }
}
</style>
