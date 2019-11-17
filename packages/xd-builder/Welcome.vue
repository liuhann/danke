<template>
  <div class="welcome">
    <nav-bar/>
    <section class="section">
      <div class="container">
        <a class="button is-primary" @click='true'>
          创建新的作品
        </a>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h2>从模板创建</h2>
        <works-column :works="myWorks" @edit="chooseDraftWork" @play="playWork" @delete="deleteWorkDraft" />
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
      myWorks: [],
      isMobile: screen.width < screen.height,
      startNav: 'mobile',
      templates: {
        books: [],
        mobiles: [],
        widescreens: []
      },
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
    this.loadDraftWorks()
    this.loadTops()
  },
  methods: {
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

    async loadTemplates () {

    },
    async loadTops () {
      const tops = await this.workdao.list({
        'system.top4': '1'
      })
      this.templates.widescreens = tops.list.filter(work => work.ratio === '16:9')
      this.templates.mobiles = tops.list.filter(work => work.ratio === '9:16')
      this.templates.books = tops.list.filter(work => work.ratio === '4:3')
    },

    playWork (work) {
      window.open('/play/full/' + work._id)
    },
    chooseFromTemplateWork () {

    },
    chooseDraftWork (work) {
      this.$router.push(this.xdUrl + '?ratio=' + work.ratio + '&work=' + work._id)
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
      this.loadDraftWorks()
    },
    goShareLink (work) {
      this.$router.push('/shared/' + work._id)
    }
  }
}
</script>

<style lang="scss">
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
