<template>
<div class="my-works body" v-if="nav='mywork'">
  <div class="content-title">我的作品</div>
  <div class="my-work-list" ref="myWorkList">
    <div class="line" v-for="(line, index) in lines" :key="index">
      <div class="work" v-for="work in line" :id="work.id" @click="editWork(work)">
        <render-scene :work="work" :scene="work.scenes[0]" :view-port="work.viewport" @click="editWork(work)"/>
        <div class="btn-more">
        </div>
      </div>
    </div>
  </div>
  <div class="empty" v-if="lines.length === 0">
    <div class="msg">还没有任何作品</div>
    <div class="desc">期待您的创作，快速开始去模板中心看看</div>
  </div>
</div>
</template>


<script>
import RenderScene from '../render/RenderScene'
import RestDAO from '../../common/dao/restdao'
import flowSchedule from '../utils/flowSchedule'

export default {
  name: 'MyWork',
  components: { RenderScene  },
  data () {
    return {
      lines: []
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },
  mounted () {
    this.loadMyWorks()
  },
  methods: {
    async loadMyWorks () {
      if (this.ctx.user) {
        const result = await this.workdao.list({
          'creator': this.ctx.user.id,
          'projection': 'scenes.1,updated,created,ratio,creator,screen,name,id'
        })
        this.works = result.list
        this.lines = flowSchedule(this.works, this.$refs.myWorkList.offsetWidth, 25, 360)
      }
    },
  }
}
</script>
<style scoped>

</style>
