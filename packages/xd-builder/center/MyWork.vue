<template>
<div class="my-works body" v-if="nav='mywork'">
  <div class="content-title">我的作品</div>
  <div class="my-work-list" ref="myWorkList">
    <div class="work" v-for="work in works" :key="work.id">
      <render-scene :work="work" :scene="work.scenes[0]" :view-port="work.viewport"/>
      <div class="actions">
        <div class="name">
          {{work.name}}
        </div>
        <div class="btns">
          <i class="el-icon-delete" @click="removeWork(work)"/>
          <i class="el-icon-edit" @click="editWork(work)"/>
        </div>
      </div>
    </div>
  </div>
  <div class="empty" v-if="works.length === 0">
    <div class="msg">还没有任何作品</div>
    <div class="desc">期待您的创作，快速开始去模板中心看看</div>
  </div>
</div>
</template>

<script>
import RenderScene from '../render/RenderScene'
import RestDAO from '../../common/dao/restdao'

export default {
  name: 'MyWork',
  components: { RenderScene  },
  data () {
    return {
      works: []
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
        for (let work of this.works) {
          work.viewport = {
            height: 256,
            width: 256 / work.screen.height * work.screen.width
          }
        }
        // this.lines = flowSchedule(this.works, this.$refs.myWorkList.offsetWidth, 25, 256)
      }
    },
    editWork (work) {
      window.open('/xd?work=' + work.id)
    },

    async removeWork (work) {
      if (confirm('确认删除作品?')) {
        await this.workdao.delete(work)
        this.loadMyWorks()
      }
    }
  }
}
</script>
<style lang="scss">
.my-works {
  .my-work-list {
    display: flex;
    flex-wrap: wrap;
    .work {
      height: 296px;
      margin: 20px 16px;
      .actions {
        display: flex;
        padding: 10px 0;
        .name {
          flex: 1;
        }
        .btns {
          display: flex;
          i {
            font-size: 16px;
            cursor: pointer;
            margin: 0 10px;
          }
        }
      }
    }
  }
}
</style>
