<template>
<div class="creative-center">
  <div class="top-header">
    <div class="left">Left</div>
    <div class="right">Right</div>
  </div>
  <div class="main">
    <div class="nav">
      <button class="button">创建新的作品</button>
      <div class="menu">
        <div class="node" :class="nav==='mywork'? 'selected': ''" @click="navMyWork">
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
      <div class="my-works body" v-if="nav='mywork'">
        <div class="content-title">我的作品</div>
        <div class="my-work-list" ref="myWorkList">
          <div class="line" v-for="(line, index) in lines" :key="index">
            <div class="work" v-for="work in line" :id="work.id" @click="editWork(work)">
              <render-scene :work="work" :scene="work.scenes[0]" :viewport="work.viewport" @click="editWork(work)"/>
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
    </div>
  </div>
</div>
</template>

<script>
import RestDAO from '../common/dao/restdao'
import flowSchedule from './utils/flowSchedule'
import RenderScene from './render/RenderScene'
import StyleRegistry from './utils/StyleRegistry'
const ratios = [{
  name: '全面屏手机',
  width: 414,
  height: 896,
  img: '/res/1x2.png',
  desc: '适用iPhone X/Mate 30等全面屏手机'
}, {
  name: '普通屏手机',
  width: 360,
  height: 640,
  img: '/res/9x16.jpg',
  desc: '适用于传统普通屏幕手机'
}, {
  name: '平板电脑(横)',
  width: 1024,
  height: 768,
  img: '/res/4x3.jpg',
  desc: '适用于iPad等4:3屏幕比例设备'
}, {
  name: '桌面电脑',
  width: 1366,
  height: 768,
  img: '/res/16x9.jpg',
  desc: '适用于桌面显示器、笔记本及电视等设备'
}, {
  name: '正方形',
  width: 640,
  height: 640,
  img: '/res/1x1.jpg',
  desc: '可以在任何设备打开，但四周会空置'
}]
export default {
  name: 'CreativeCenter',
  components: { RenderScene  },
  filters: { },
  data () {
    return {
      nav: 'mywork',
      lines: []
    }
  },
  computed: {
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.navMyWork()
  },
  mounted () {
    this.ctx.styleRegistry = new StyleRegistry()
  },
  methods: {
    navMyWork () {
      this.nav = 'mywork'
      this.loadMyWorks()
    },
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

    editWork (work) {
      window.open('/xd?work=' + work.id)
    },

    xd (width, height) {
      window.open(`/xd?width=${width}&height=${height}`)
    },

    playWork (work) {
      window.open('/play/fit/' + work._id)
    },
    chooseFromTemplateWork () {

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
