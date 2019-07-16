<template>
<el-dialog
  width="800px"
  title="打开已有作品"
  :visible.sync="dialogVisible">
  <div class="work-list-container columns">
    <div class="drafts column">
      <div>草稿</div>
      <ul class='work-list'>
        <li class="work-item" :class="choosedWork.id===work.id?'current': ''" v-for="work in works" :key="work.id" @click="chooseWork(work)">
          <div class="work-title">{{work.title}}</div>
          <div class="updated">{{formateTime(work.updated)}}</div>
          <div class="operation"><i class="icon-trash-empty" @click="deleteWorkDraft(work)"></i></div>
        </li>
      </ul>
    </div>
    <div class="previews column is-narrow">
      <div style="width: 360px; height: 360px;" class="centering">
        <player v-if="choosedWork" :work="choosedWork" :device="previewDevice"></player>
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
import { Dialog, MessageBox } from 'element-ui'
import RestDAO from '../../common/dao/restdao'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import Player from '../../xd-player/Player'
import { fitToContainer } from '../../danke-core/utils/common'
export default {
  components: {
    Player,
    Dialog
  },
  data () {
    return {
      works: [],
      choosedWork: {},
      previewDevice: {},
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
      this.previewDevice = fitToContainer(work.ratio, 320, 320)
    },
    async chooseWorkOpen () {
      if (this.choosedWork.id) {
        this.$emit('choose', this.choosedWork)
      }
      this.choosedWork = {}
      this.dialogVisible = false
    },
    async deleteWorkDraft (work) {
      await MessageBox.confirm('确认删除此作品', '注意')
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
  .previews {
    .device {
      border: 1px solid #ddd;
      border-radius: 20px;
    }
  }
}
</style>
