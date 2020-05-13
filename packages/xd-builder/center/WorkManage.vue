<template>
  <div class="work-manage body">
    <div class="content-title">作品管理</div>
    <div class="work-list">
      <div class="work" v-for="work in works" :key="work.id">
        <div class="work-item">
          <div class="title">{{work.title}}</div>
          <div class="creator">{{work.creator}}</div>
          <div class="is-home">{{(work.system && work.system.site)}}</div>
          <div class="action">
            <el-button size="mini" type="text" @click="openWork(work)">打开</el-button>
            <el-button size="mini" type="text" @click="setPageRecommand(work)">首页推荐</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-pagination :current-page.sync="page" :page-size="size" :total="total" @current-change="pageChange"/>
  </div>
</template>

<script>
import { Pagination, Button } from 'element-ui'
import RestDAO from '../../common/dao/restdao'

export default {
  name: 'WorkManage',
  components: {
    [Pagination.name]: Pagination,
    [Button.name]: Button
  },
  data () {
    return {
      works: [],
      page: 1,
      size: 20,
      total: 0
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },
  mounted () {
    this.fetchWorks()
  },
  methods: {
    setPageRecommand (work) {
      this.workdao.patch(work._id, {
        system: {
          site: 'on'
        }
      })
    },
    async fetchWorks () {
      if (this.ctx.user && this.ctx.user.id === '15011245191') {
        const result = await this.workdao.list({
          projection: 'updated,created,ratio,creator,name,id,viewBox,likes,comments,name,title,system',
          page: this.page,
          count: this.size
        })
        this.works = result.list
        this.total = result.total
      }
    },
    pageChange () {
      this.fetchWorks()
    },
    openWork (work) {
      window.open('/xd?work=' + work.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.work-item {
  height: 40px;
  line-height: 40px;
  display: flex;
  .title {
    width: 300px;
  }
  .is-home {
    text-align: center;
    width: 40px;
  }
}
</style>
