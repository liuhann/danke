<template>
  <div class="welcome">
    <nav-bar/>
    <section class="section has-text-centered hero is-medium primary-background">
      <p class="title is-5 is-spaced has-text-white is-family-sans-serif">
        设计适用于各种场景的展示页面
      </p>
      <p class="is-spaced has-text-white is-family-sans-serif">
        <router-link class="button is-primary is-large" to="/xd">
          创建新的作品
        </router-link>
      </p>
    </section>
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
import Tabs from '../common/components/Tabs.vue'
import NavBar from '../site/components/NavBar'
import RestDAO from '../common/dao/restdao'
import dayjs from 'dayjs'
import WorkCover from './components/WorkCover.vue'
import WorksColumn from './components/WorksColumn.vue'

const welcomeRatios = {
  '9:16': '2:3',
  '4:3': '4:3',
  '16:9': '3:2'
}
const textAdjusts = {
  '9:16': 2,
  '4:3': 0.8,
  '16:9': 0.7
}
const screenRatios = {
  'mobile': '9:16',
  'widescreen': '16:9',
  'books': '4:3'
}
export default {
  name: 'Welcome',
  components: {
    WorksColumn,
    WorkCover,
    Tabs,
    NavBar
  },
  filters: {
    displayRatio (r) {
      return welcomeRatios[r] || '1:1'
    },
    textAdjust (r) {
      return textAdjusts[r] || 3
    }
  },
  data () {
    return {
      isMobile: screen.width < screen.height,
      startNav: 'mobile',
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

    playWork (work) {
      window.open('/play/fit/' + work._id)
    },
    chooseFromTemplateWork () {

    },
    chooseDraftWork (work) {
      this.$router.push(this.xdUrl + '?&work=' + work._id + '&ratio=' + work.ratio)
    },
    chooseStartWork (ratio) {
      this.$router.push(this.xdUrl + '?ratio=' + screenRatios[ratio] + '&work=new')
    },
    formateTime (mill) {
      return dayjs(mill).format('YYYY-MM-DD HH:mm:ss')
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
