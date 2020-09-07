<template>
  <div class="my-works body">
    <div class="content-title">我的作品</div>
    <div ref="myWorkList" class="my-work-list">
      <div v-for="work in verticalWorks" :key="work.id" class="work">
        <div class="work-container" :style="Object.assign({
          background: work.color
        }, verticalViewPortStyle(work))" @click="previewWork(work)"
        >
          <div class="work-viewport" :style="verticalViewPortStyle(work)">
            <render-scene :view-box="work.viewBox || work.screen" :scene="work.scenes[0]" :view-port="verticalViewPort(work)" :stage="work.stage" />
          </div>
        </div>
        <div class="actions">
          <div class="btns">
            <i class="el-icon-video-camera" @click="replayWork(work)" />
            <i class="el-icon-delete" @click="removeWork(work)" />
            <i class="el-icon-edit" @click="editWork(work)" />
          </div>
        </div>
      </div>
    </div>
    <div ref="myWorkList" class="my-work-list">
      <div v-for="work in horizontalWorks" :key="work.id" class="work">
        <div class="work-container" :style="Object.assign({
          background: work.color
        }, horizontalViewPortStyle(work))" @click="previewWork(work)"
        >
          <div class="work-viewport" :style="horizontalViewPortStyle(work)">
            <render-scene :view-box="work.viewBox || work.screen" :scene="work.scenes[0]" :view-port="horizontalViewPort(work)" :stage="work.stage" />
          </div>
        </div>
        <div class="actions">
          <div class="btns">
            <i class="el-icon-video-camera" @click="replayWork(work)" />
            <i class="el-icon-delete" @click="removeWork(work)" />
            <i class="el-icon-edit" @click="editWork(work)" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="!loading && works.length === 0" class="empty">
      <div class="msg">还没有任何作品</div>
      <div class="desc">期待您的创作，快速开始去模板中心看看</div>
    </div>
    <div v-if="loading" class="empty">
      <div class="msg">作品获取中</div>
      <div class="desc">请稍候</div>
    </div>
  </div>
</template>

<script>
import RenderScene from '../render/RenderScene.vue'
import workListMixins from '../mixins/workListMixins'

export default {
  name: 'MyWork',
  components: { RenderScene  },
  mixins: [ workListMixins ],
  data () {
    return {}
  },
  computed: {
    horizontalWorks () {
      return this.works.filter(work => work.viewBox && work.viewBox.width >= work.viewBox.height)
    },

    verticalWorks() {
      return this.works.filter(work => work.viewBox && work.viewBox.height > work.viewBox.width)
    }
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
      margin: 5px;
      cursor: pointer;
      position: relative;
      .work-container {
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
        position: absolute;
        width: 100%;
        background: rgba(0,0,0, .4);
        bottom: 0;
        z-index: 9999;
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
            color: #fff;
            margin: 0 10px;
          }
        }
      }
    }
  }
}
</style>
