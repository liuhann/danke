<template>
  <div class="my-works body">
    <div class="content-title">我的作品</div>
    <div ref="myWorkList" class="my-work-list">
      <div v-for="work in works" :key="work.id" class="work">
        <div class="preview">
          <div :style="containerFitSize(work)" class="work-image-container">
            <img v-if="work.snapshot" :src="getImageUrl(work.snapshot, 154, 96, 'lfit')">
          </div>
          <span v-if="!work.snapshot" class="no-snapshot">正在生成预览</span>
        </div>
        <div class="details">
          <div class="work-title">
            {{ work.title }}
          </div>
          <div class="work-modified">
            更新： {{ formatTime(work.updated, 'YYYY-M-DD HH:mm') }}
          </div>
        </div>
        <div class="actions">
          <div class="btns">
            <button @click="removeWork(work)"><i class="el-icon-delete" />删除</button>
            <button @click="editWork(work)"><i class="el-icon-edit" />编辑</button>
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
import workListMixins from '../mixins/workListMixins'
import dayjs from 'dayjs'
import { fitRectIntoBounds } from '../mixins/rectUtils'
import { getImageUrl } from '../mixins/imageUtils'

export default {
  name: 'MyWork',
  components: {
  },
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
    getImageUrl,
    containerFitSize (work) {
      const fit = fitRectIntoBounds(work.viewBox, {
        width: 154,
        height: 96
      })

      return {
        width: fit.width + 'px',
        height: fit.height + 'px'
      }
    },
    formatTime (mill, tpl) {
      return dayjs(mill).format(tpl)
    },
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
  max-width: 1020px;
  margin: 1rem auto;
  background-color: #fff;
  .my-work-list {
    .work {
      margin: 0;
      position: relative;
      display: flex;
      padding: 12px;
      border-bottom: 1px solid #e7e7e7;
      .preview {
        border:1px solid #e7e7e7;
        width: 154px;
        height: 96px;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        .no-snapshot {
          position: absolute;
          color: #aaacad;
        }
        .work-image-container {
          background-color: #fff;
          background-image: linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef),
          linear-gradient(45deg, #efefef 25%, transparent 25%, transparent 75%, #efefef 75%, #efefef);
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
        }

      }
      .details {
        padding: 10px 20px;
        flex: 1;
        .work-title {
          font-size: 16px;
          color: #212121;
        }
        .work-modified {
          margin-top: 15px;
          color: #aaacad;
        }
      }
      .actions {
        justify-content: center;
        .name {
          flex: 1;
        }
        .btns {
          display: flex;
          button {
            border: 1px solid #e7e7e7;
            font-size: 14px;
            color: #505050;
            width: 84px;
            height: 32px;
            line-height: 18px;
            border-radius: 5px;
            background-color: #fff;
            &:hover {
              border-color: var(--mainColor);
              color: var(--mainColor);
            }
          }
          i {
            font-size: 16px;
            cursor: pointer;
            margin: 0 5px;
          }
        }
      }
    }
  }
}
</style>
