<template>
<div class="top-bar is-clearfix">
  <div class="flex-1">
    <a class="button is-white icon-menu" @click="setLeftToggleShow"></a>
  </div>
  <div class="tools-bar">
    <a class="button is-small" @click="openAudioDialog">
      音频
    </a>
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
  <dialog-audio-list ref="dialogAudioList"></dialog-audio-list>
</div>
</template>
<script>
import { Dialog } from 'element-ui'
import DialogAudioList from './DialogAudioList'
export default {
  name: 'TopBar',
  props: {
    work: {
      type: Object
    }
  },
  components: {
    DialogAudioList,
    Dialog
  },
  data () {
    return {
      isEditName: false
    }
  },
  inject: ['zoomIn', 'zoomOut', 'runWork', 'zoom', 'setLeftToggleShow', 'publishShareWork'],
  methods: {
    openAudioDialog () {
      this.$refs.dialogAudioList.open(this.work)
    }
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
