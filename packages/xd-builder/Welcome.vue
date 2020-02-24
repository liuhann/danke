<template>
  <div class="welcome">
    <nav-bar/>
    <section class="section has-text-centered hero is-medium primary-background">
      <p class="is-spaced has-text-white is-family-sans-serif">
        <button class="button is-primary is-large" @click="newShow = !newShow">
          创建新的作品
        </button>
      </p>
      <div class="container new-container" v-if="newShow">
        <div class="line-cross">
          <div class="ratio" v-for="(ratio, index) in ratios" :key="index" @click="xd(ratio.width, ratio.height)">
            <div class="media-image">
              <img :src="ratio.img">
            </div>
            <div class="media-content">
              <div class="media-title">{{ratio.name}}</div>
              <div class="hover">{{ratio.desc}}</div>
            </div>
          </div>
        </div>
        <i class="el-icon-circle-close close-new" @click="newShow = false"/>
      </div>
    </section>
    <img svg-inline style="--strokeColor: red;" src='./svg/bold-text-option.svg'>
    <section class="section" style="background: #fff;">
      <div class="container">
        <h2>我的作品</h2>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <works-column :works="works" @edit="chooseDraftWork" @play="playWork" @delete="deleteWorkDraft" />
      </div>
    </section>
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'
import NavBar from '../site/components/NavBar'
import RestDAO from '../common/dao/restdao'
import WorksColumn from './components/WorksColumn.vue'
import SVG from './svg/bold-text-option.svg'
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
  name: 'Welcome',
  components: {
    WorksColumn,
    NavBar
  },
  filters: { },
  data () {
    return {
      SVG,
      newShow: false,
      isMobile: screen.width < screen.height,
      startNav: 'mobile',
      ratios,
      templates: [],
      works: [],
      drafts: {
        books: [],
        mobiles: [],
        widescreens: []
      },
      shares: {
        books: [],
        mobiles: [],
        widescreens: []
      }
    }
  },
  computed: {
    tabs () {
      return [{
        key: 'mobile',
        icon: 'icon-mobile-1',
        title: '竖屏'
      }, {
        key: 'widescreen',
        icon: 'icon-desktop',
        title: '宽屏'
      }, {
        key: 'tablet',
        icon: 'icon-tablet-1',
        title: '平板'
      }]
    },
    xdUrl () {
      return this.isMobile ? '/xdm' : '/xd'
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.loadWorkTemplates()
    this.loadMyWorks()
  },
  methods: {
    /**
     * 加载用户可用的模板
     * @returns {Promise<void>}
     */
    async loadWorkTemplates () {
      const result = await this.workdao.list({
        'sys.template': '1'
      })
      return result.list
    },

    async loadMyWorks () {
      if (this.ctx.user) {
        const result = await this.workdao.list({
          'creator': this.ctx.user.id,
          'projection': 'cover,updated,created,ratio,creator,frames'
        })
        this.works = result.list
      }
    },

    async loadDraftWorks () {
      const result = await this.workdao.list()
      this.myWorks = result.list
      this.drafts.widescreens = result.list.filter(work => work.ratio === '16:9' && work.isDraft)
      this.drafts.mobiles = result.list.filter(work => work.ratio === '9:16' && work.isDraft)
      this.drafts.books = result.list.filter(work => work.ratio === '4:3' && work.isDraft)
      this.shares.widescreens = result.list.filter(work => work.ratio === '16:9' && !work.isDraft)
      this.shares.mobiles = result.list.filter(work => work.ratio === '9:16' && !work.isDraft)
      this.shares.books = result.list.filter(work => work.ratio === '4:3' && !work.isDraft)
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

.section.primary-background {
  background-color: #47b17c;
  color: #fff;
  background-image: url('/res/icons-background.svg');
}
.section {
  background-color: #f4f4f4;
}

.new-container {
  background: rgba(255,255,255, .1);
  border-radius: 10px;
  .close-new {
    font-size: 16px;
  }
}
.line-cross {
  margin-top: 20px;
  display: flex;
  width: 100%;
  .ratio {
    margin: 20px 10px 10px;
    width: 160px;
    height: 280px;
    .media-image {
      height: 200px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center bottom;
      }
    }
    .media-content {
      height: 80px;
      .media-title {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        padding: 5px;
      }
      .hover {
        color: #fefefe;
        text-align: center;
        display: none;
        font-size: 12px;
      }
    }
    &:hover {
      cursor: pointer;
      .media-image {
      }
      .media-title {
      }
      .hover {
        display: block;
      }
    }
  }
}

.add-work {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  border: 1px dashed #bbb;
  border-radius: 1rem;
  height: 100%;
  &:hover {
    color: #47b17c;
    border: 2px dashed #47b17c;
    cursor: pointer;
  }
}
.welcome-title {
  font-size: 1rem;
  color: #333;
  padding: .25rem .5rem;
  height: 2.5rem;
  margin: 1rem 0;
}
.work-list {
  .work-item {
    float: left;
    height: 240px;
    margin-right: 2rem;
    .work-info {
      align-items: center;
      display: flex;
      padding: .5rem;
      .work-title {
        flex: 1;
        font-size: .8rem;
        color: #333;
      }
    }
  }
}
</style>
