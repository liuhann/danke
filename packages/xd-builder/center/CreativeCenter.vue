<template>
<div class="creative-center">
  <div class="top-header">
    <div class="left">Left</div>
    <div class="right">Right</div>
  </div>
  <div class="main">
    <div class="nav">
      <el-popover
        placement="right-start"
        title="选择页面类型"
        width="200"
        trigger="click">
        <div class="choose-work-type">
          <div v-for="(type, index) of workType" :key="index" class="type" @click="xd(type)">
            <div></div>
            <div class="name">{{type.name}}</div>
          </div>
        </div>
        <button class="button" slot="reference">创建新的作品</button>
      </el-popover>
      <div class="menu">
        <div class="node" :class="nav==='my'? 'selected': ''" @click="navMyWork">
          <span>我的作品</span>
        </div>
        <div class="node">
          <span>模板中心</span>
        </div>
        <div class="node">
          <span>我的资源</span>
        </div>
        <div class="tree-node">
        </div>
      </div>
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</div>
</template>

<script>
import StyleRegistry from '../utils/StyleRegistry'
import { Popover } from 'element-ui'
import workType from '../utils/workType'
export default {
  name: 'CreativeCenter',
  components: {
    [Popover.name]: Popover
  },
  filters: { },
  data () {
    return {
      workType,
      lines: []
    }
  },
  computed: {
    nav () {
      const path = this.$route.path
      return path.substring(path.lastIndexOf('/') + 1)
    }
  },
  created () {

  },
  mounted () {
    this.ctx.styleRegistry = new StyleRegistry()
  },
  methods: {
    navMyWork () {
      this.$router.replace('/creative/my')
    },

    editWork (work) {
      window.open('/xd?work=' + work.id)
    },

    xd ({ width, height }) {
      window.open(`/xd?width=${width}&height=${height}`)
    },

    playWork (work) {
      window.open('/play/fit/' + work._id)
    },

    chooseDraftWork (work) {
      this.$router.push(this.xdUrl + '?&work=' + work._id + '&ratio=' + work.ratio)
    },
    async deleteWorkDraft (work) {
      await MessageBox.confirm('确认删除此作品', '注意')
      await this.workdao.delete(work)
      this.works = []
      this.loadMyWorks()
    },
    goShareLink (work) {
      this.$router.push('/shared/' + work._id)
    }
  }
}
</script>

<style lang="scss">
.creative-center {
  height: 100%;
  display: flex;
  flex-direction: column;
  .top-header {
    height: 5rem;
    box-shadow: 0 0 3px #ccc;
    padding: 0 2rem;
  }
  .main {
    display: flex;
    padding: 0 2rem;
    flex: 1;
    .nav {
      width: 200px;
      height: calc(100% - 4rem);
      margin: 2rem 0;
      box-sizing: content-box;
      button {
        font-size: 1.5rem;
        color: #fff;
        width: 160px;
        margin: 0 20px;
        height: 40px;
        letter-spacing: .2rem;
        line-height: 1.4;
        transition: background-color .1s linear,border-color .1s linear,color .1s linear;
        vertical-align: middle;
        align-items: center;
        background-color: #00c4cc;
        border: 2px solid transparent;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        padding: 0 6px;
      }
      .menu {
        margin: 1rem 0;
        display: flex;
        flex-direction: column;
        .node {
          font-size: 1.5rem;
          padding: 8px 12px;
          cursor: pointer;
          border-radius: 4px;
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          position: relative;
          box-sizing: border-box;
          white-space: nowrap;
          transition: background-color .15s ease-in-out,opacity .15s ease-in-out;
          color: unset;
          text-decoration: unset;
          &:hover {
            background-color: rgba(14,19,24,.07);
          }
          &.selected {
            font-weight: bold;
            border-left: 4px solid #00c4cc
          }
        }
      }
    }
  }
  .content {
    flex: 1;
    .body {
      .my-work-list {
        .line {
          display: flex;
          justify-content: space-between;
          margin: 2rem 0;
        }
      }
    }
    .content-title {
      font-size: 2.4rem;
      padding: 1rem;
    }
    .empty {
      font-size: 2rem;
      color: #333;
      padding: 10rem;
      text-align: center;
      .desc {
        color: #999;
        line-height: 4rem;
        font-size: 1.6rem;
      }
    }
  }
}
</style>
