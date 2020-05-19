<template>
<div class="my-works body">
  <div class="content-title">我的作品</div>
  <div class="my-work-list" ref="myWorkList">
    <div class="work" v-for="work in works" :key="work.id">
      <div class="work-container" @click="previewWork(work)" :style="{
         background: work.color
      }">
        <div class="work-viewport" :style="{
            width: work.viewport.width + 'px',
            height: work.viewport.height + 'px',
        }">
          <render-scene :view-box="work.viewBox || work.screen" :scene="work.scenes[0]" :view-port="work.viewport" :stage="work.stage"/>
        </div>
      </div>
      <div class="actions">
        <div class="btns">
          <i class="el-icon-video-camera" @click="replayWork(work)"/>
          <i class="el-icon-delete" @click="removeWork(work)"/>
          <i class="el-icon-edit" @click="editWork(work)"/>
        </div>
      </div>
    </div>
  </div>
  <div class="empty" v-if="!loading && works.length === 0">
    <div class="msg">还没有任何作品</div>
    <div class="desc">期待您的创作，快速开始去模板中心看看</div>
  </div>
  <div class="empty" v-if="loading">
    <div class="msg">作品获取中</div>
    <div class="desc">请稍候</div>
  </div>
</div>
</template>

<script>
import RenderScene from '../render/RenderScene'
import workListMixins from '../mixins/workListMixins'

export default {
  name: 'MyWork',
  components: { RenderScene  },
  mixins: [ workListMixins ],
  data () {
    return {}
  },
  created () { },
  mounted () {
    this.loadWorks()
  },
  methods: {
    viewport () {
      return {
        width: 200,
        height: 200
      }
    },
    listQuery () {
      return {
        creator: this.ctx.user.id,
        isBlock: 'no'
      }
    },
    previewWork (work) {
      window.open('/slide/' + work.id)
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
        this.loadWorks()
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
      .work-container {
        width: 200px;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      .work-viewport {
        .scene {
          position: relative;
          overflow: hidden;
          .element {
            position: absolute;
          }
        }
      }

      &:hover {
        .scene-wrapper {
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
