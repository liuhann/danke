<template>
<el-dialog 
  title="打开已有作品"
  :visible.sync="dialogVisible">
  <div class="work-list-container">
    <div class="drafts">
      <ul class='work-list'>
        <li class="work-item" :class="choosedWork.id===work.id?'current': ''" v-for="work in works" :key="work.id" @click="chooseWork(work)">
          <div class="work-title">{{work.title}}</div>
          <div class="updated">{{work.updated}}</div>
          <div class="operation"><i class="icon-trash-empty" @click="deleteWorkDraft(work)"></i></div>
        </li>
      </ul>
    </div>
    <div class="publishs">
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
    .work-item {
      padding: 8px 5px;
      display: flex;
      font-size: .9rem;
      color: #999;
      &.current {
        border: 1px solid #066;
      }
      &:hover {
        background: #f2f2f2;
      }
      .work-title {
        flex: 1;
      }
    }
  }
  .publishs {
    flex: 2;
  }
}
</style>
