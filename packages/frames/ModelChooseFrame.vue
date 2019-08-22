<template>
<el-dialog
  title="选择动画效果"
  class="modal-frame-choose"
  top="0"
  :fullscreen="isMobile? true: false"
  :visible.sync="centerDialogVisible">
  <frame-box ref="frameBox"></frame-box>
  <span slot="footer" class="dialog-footer">
    <button class="button icon-plus is-info">创建</button>
    <button class="button is-link is-outlined" @click="choose">选择</button>
  </span>
</el-dialog>
</template>

<script>
import { Dialog } from 'element-ui'
import FrameBox from './FrameBox.vue'
import Vue from 'vue'
Vue.use(Dialog)
export default {
  name: 'ModelChooseFrame',
  components: { FrameBox, Dialog },
  props: {

  },
  mounted () {
  },
  data () {
    return {
      centerDialogVisible: false,
      isMobile: window.outerWidth < 769,
      isShow: false,
      type: '',
      skip: 0,
      total: 0,
      animations: []
    }
  },
  created () {

  },
  methods: {
    chooseFrame (type, choosedCallback) {
      this.type = type
      this.skip = 0
      this.animations = []
      this.total = 0
      this.centerDialogVisible = true
      this.choosedCallback = choosedCallback
    },
    choose () {
      this.centerDialogVisible = false
      let animation = this.$refs.frameBox.currentAnimation
      this.choosedCallback(animation)
    }
  }
}
</script>

<style lang="scss">
.modal-frame-choose {
  z-index: 10001;
  .el-dialog__header {
    padding: 10px 20px 5px 20px;
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .modal-content {
    background-color: #fff;
  }

  .frame-box-columns {
    overflow: hidden;
    .column-list {
      overflow-y: auto;
    }
  }

  .play-area {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    background-color: rgba(0, 0, 0, .2);
    .preview-box {
      background-color: #FF4B4B;
      width: 80px;
      height: 80px;
      overflow: hidden;
      box-sizing: border-box;
    }
  }
  .play-area:before {
    content: "";
    display: block;
    padding-top: 100%;  /* ratio of 1:1*/
  }
}

</style>
