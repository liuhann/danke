<template>
<div id="danke-manage">
  <div class="work-list">
    <table>
      <tr>
        <th style="width: 160px">操作</th>
        <th>标题</th>
        <th>创建者</th>
        <th>shi</th>
      </tr>
      <tr class="one-story" v-for="work in works" :key="work._id">
        <td>
          <a @click="setAsRecommendation(work)">推荐</a>
        </td>
        <td><input style="width: 300px;" v-model="work.title"></td>
        <td>{{work.creator}}</td>
        <td><input v-model="work.updated"></td>
      </tr>
    </table>
  </div>
</div>
</template>

<script>
import RestDAO from '../common/dao/restdao.js'
export default {
  name: 'DankeAdmin',
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 50,
      total: 0,
      works: []
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.loadWorks()
  },
  methods: {
    async loadWorks () {
      this.loading = true
      const result = await this.workdao.list({
        page: this.currentPage,
        count: this.pageSize,
        projection: 'title,creator,updated,system'
      })
      this.loading = false
      this.works = result.list
      this.total = result.total
    },
    async setAsRecommendation (work) {
      await this.workdao.patch(work._id, {
        system: {
          top4: "1"
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
