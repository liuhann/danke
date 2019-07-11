<template>
<el-dialog
  width="800px"
  title="开始"
  :visible.sync="dialogVisible">
  <div class="start-new-container">
    <div class="ratio-list">
      <div class="ratio">
      </div>
      <div class="ratio">
      </div>
      <div class="ratio">
      </div>
    </div>
  </div>
  <span slot="footer" class="dialog-footer">
    <a class="button is-small" @click="dialogVisible = false">
        取 消
    </a>
    <a class="button is-small is-primary" @click="chooseWorkOpen">
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
      works: [],
      choosedWork: {},
      dialogVisible: false
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    dayjs.locale('zh-cn')
  },
  methods: {
    async open () {
      this.dialogVisible = true
      const result = await this.workdao.list()
      this.works = result.list
    },
    chooseWork (work) {
      this.choosedWork = work
    },
    async chooseWorkOpen () {
      if (this.choosedWork.id) {
        this.$emit('choose', this.choosedWork)
      }
      this.choosedWork = {}
      this.dialogVisible = false
    },
    async deleteWorkDraft (work) {
      await this.workdao.delete(work)
      const result = await this.workdao.list()
      this.works = result.list
    },
    formateTime (mill) {
      return dayjs(mill).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
<style lang="scss">
.work-list-container {
  display: flex;
  .drafts {
    flex: 3;
    padding: 0 5px;
    height: 360px;
    overflow: auto;
    .work-list {
      border: 1px solid #eee;
      border-radius: 10px;
    }
    .work-item {
      padding: 5px 10px;
      font-size: 1rem;
      color:rgb(89, 96, 99);
      position:relative;
      &:hover {
        background: #f2f2f2;
      }
      &.current {
        background: rgb(68, 81, 94);
        color: #fff;
      }
      .work-title {
        flex: 1;
      }
      .operation {
        position: absolute;
        right: 10px;
        top: 10px;
      }
      .updated {
        white-space: nowrap;
        font-weight: 700;
        font-size: 12px;
        color: #6e848b;
      }
    }
  }
  .publishs {
    flex: 2;
  }
}
</style>
