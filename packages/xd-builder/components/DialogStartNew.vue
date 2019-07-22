<template>
<el-dialog
  width="640px"
  title="创建新的作品"
  :visible.sync="dialogVisible">
  <div class="start-new-container">
    <div class="device-type-list">
      <div class="device-type" :class="ratio==='9:16'?'checked':''" @click="ratio='9:16'">
        <i class="icon-mobile-1"></i>
        <div class="desc">手机</div>
        <div class="desc">近似9:16比例</div>
      </div>
      <div class="device-type" :class="ratio==='4:3'?'checked':''" @click="ratio='4:3'">
        <i class="icon-tablet-1"></i>
        <div class="desc">平板</div>
      </div>
      <div class="device-type" :class="ratio==='16:9'?'checked':''" @click="ratio='16:9'">
        <i class="icon-laptop"></i>
        <div class="desc">桌面</div>
      </div>
    </div>
  </div>
  <span slot="footer" class="dialog-footer">
    <a class="button is-small is-primary" @click="chooseStartWork">
        确 定
    </a>
  </span>
</el-dialog>
</template>
<style lang="scss">
  .start-new-container {
    .device-type-list {
      display: flex;
      height: 12rem;
      justify-content: center;
      .device-type {
        cursor: pointer;
        width: 160px;
        flex-direction: column;
        display: flex;
        align-items: center;
        border-radius: 8px;
        margin: 10px;
        &:hover {
          border: 1px solid #00bf72;
          i {
            color: #47b17c;
            transform: scale(1.6);
          }
          .desc {
            color: #47b17c;
          }
        }
        i {
          transition: transform .2s ease-in;
          margin-top: 3rem;
          font-size: 3rem;
          color: #7a7a7a;
        }
        .desc {
          width: 8rem;
          text-align: center;
        }

        &.checked {
          background-color: #00bf72;
          i {
            color: #fff;
            transform: scale(1.6);
          }
          .desc {
            color: #fff
          }
        }
      }
    }
  }
</style>
<script>
import { Dialog } from 'element-ui'
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
      this.dialogVisible = false
      this.$emit('choose', this.ratio)
    }
  }
}
</script>
