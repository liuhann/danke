<template>
<div class="my-works body">
  <div class="content-title">我的作品</div>
  <div class="my-work-list" ref="myWorkList">
    <div class="work" v-for="work in works" :key="work.id">
      <render-scene :work="work" :scene="work.scenes[0]" :view-port="work.viewport" :stage="work.stage"/>
      <div class="actions">
        <div class="btns">
          <i class="el-icon-video-camera" @click="replayWork(work)"/>
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
import StyleRegistry from '../utils/StyleRegistry'

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
    this.svgdao = new RestDAO(this.ctx, 'danke/svg')
    this.ctx.styleRegistry = new StyleRegistry()
  },
  mounted () {
    this.loadMyWorks()
  },
  methods: {
    async loadMyWorks () {
      if (this.ctx.user) {
        const result = await this.workdao.list({
          'creator': this.ctx.user.id,
          'projection': 'scenes.1,updated,created,ratio,creator,screen,name,id,frames'
        })

        const svgs = []
        for (let work of result.list) {
          work.scenes[0].elements.forEach( element=> {
            if (element.svg) {
              svgs.push(element.svg)
            }
          })
          work.stage = 'enter'

          if (work.frames) {
            this.ctx.styleRegistry.addFrames(work.frames)
          }
        }
        console.log('svgs', svgs)
        const svgRes = await this.svgdao.multiGet(svgs)
        for (let res of svgRes.list) {
          this.ctx.styleRegistry.addVector(res)
        }

        this.works = result.list
        for (let work of this.works) {
          work.viewport = {
            height: 200,
            width: 200 / work.screen.height * work.screen.width
          }
        }
        // this.lines = flowSchedule(this.works, this.$refs.myWorkList.offsetWidth, 25, 256)
      }
    },

    replayWork (work) {
      work.stage = 'exist'
      setTimeout(() => {
        work.stage = 'enter'
      }, 100)
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
      height: 246px;
      margin: 20px 16px;
      cursor: pointer;

      &:hover {
        .scene {
          border: 1px solid var(--mainColorHover);
        }
        .actions {
          display: flex;
        }
      }

      .actions {
        display: none;
        padding: 10px 0;
        justify-content: center;
        .name {
          flex: 1;
        }
        .btns {
          display: flex;
          i {
            font-size: 16px;
            cursor: pointer;
            color: var(--mainColor);
            margin: 0 10px;
          }
        }
      }
    }
  }
}
</style>
