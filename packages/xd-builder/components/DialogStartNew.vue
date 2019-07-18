<template>
<el-dialog
  width="640px"
  title="开始"
  :visible.sync="dialogVisible">
  <div class="start-new-container">
    <div class="device-type-list">
      <div class="device-type" :class="ratio==='9:16'?'checked':''" @click="ratio='9:16'">
        <i class="icon-mobile-1"></i>
        <div class="desc">适合手机等设备竖向观看</div>
      </div>
      <div class="device-type" :class="ratio==='4:3'?'checked':''" @click="ratio='4:3'">
        <i class="icon-tablet-1"></i>
        <div class="desc">适合平板等设备横向观看，比例为4：3</div>
      </div>
      <div class="device-type" :class="ratio==='16:9'?'checked':''" @click="ratio='16:9'">
        <i class="icon-laptop"></i>
        <div class="desc">适合桌面等16:9横向屏幕</div>
      </div>
    </div>
  </div>
  <span slot="footer" class="dialog-footer">
    <a class="button is-small" @click="dialogVisible = false">
        取 消
    </a>
    <a class="button is-small is-primary" @click="chooseStartWork">
        确 定
    </a>
  </span>
</el-dialog>
</template>
<script>
import { Dialog } from 'element-ui'
import RestDAO from '../../common/dao/restdao'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
export default {
  components: {
    Dialog
  },
  data () {
    return {
      ratio: '',
      dialogVisible: false
    }
  },
  created () {
  },
  methods: {
    open () {
      this.dialogVisible = true
    },
    chooseStartWork () {

    }
  }
}
</script>
<style lang="scss">
.start-new-container {
  .device-type-list {
    display: flex;
    height: 320px;
    .device-type {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        font-size: 24px;
        color: #7a7a7a;
      }
    }
  }
}
</style>
