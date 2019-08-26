<template>
  <div class="welcome">
    <nav-bar/>
    <section class="section">
      <div class="container">
        <h4 class="subtitle is-4">创建新的作品</h4>
        <tabs
          v-model="startNav"
          :tabs="tabs"
          size="is-medium"/>
        <div
          v-if="startNav === 'widescreen'"
          class="columns is-mobile is-multiline is-1">
          <div
            class="column is-half-mobile is-one-quarter-tablet"
            @click="chooseStartWork('16:9')">
            <div class="add-work">
              <i class="icon-plus-1"/>
            </div>
          </div>
          <div
            v-for="work in templates.widescreens"
            :key="work.id"
            class="column is-half-mobile is-one-quarter-tablet">
            <work-cover
              :work="work"
              :ratio="work.ratio"/>
          </div>
        </div>
        <div
          v-if="startNav === 'mobile'"
          class="columns is-mobile is-multiline is-1">
          <div
            class="column is-one-third-mobile is-2-tablet"
            @click="chooseStartWork('9:16')">
            <div class="add-work">
              <i class="icon-plus-1"/>
            </div>
          </div>
          <div
            v-for="work in templates.mobiles"
            :key="work.id"
            class="column is-one-third-mobile is-2-tablet">
            <work-cover
              :work="work"
              :ratio="work.ratio"/>
          </div>
        </div>
        <div
          v-if="startNav === 'tablet'"
          class="columns is-mobile is-multiline is-1">
          <div
            class="column is-half-mobile is-one-quarter-tablet"
            @click="chooseStartWork('4:3')">
            <div class="add-work">
              <i class="icon-plus-1"/>
            </div>
          </div>
          <div
            v-for="work in templates.books"
            :key="work.id"
            class="column is-half-mobile is-2-tablet">
            <work-cover
              :work="work"
              :ratio="work.ratio"
              @play="playWork(work._id)"
              @edit="chooseFromTemplateWork(work)"/>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h4 class="subtitle is-4">打开草稿</h4>
        <works-column :works="drafts.widescreens" @edit="chooseDraftWork" @play="playWork" @delete="deleteWorkDraft"></works-column>
        <works-column :works="drafts.mobiles" @edit="chooseDraftWork" @play="playWork" @delete="deleteWorkDraft"></works-column>
        <works-column :works="drafts.books" @edit="chooseDraftWork" @play="playWork" @delete="deleteWorkDraft"></works-column>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <h4 class="subtitle is-4">我发布的作品</h4>
        <works-column :works="shares.widescreens" @share-info="goShareLink" @play="playWork" @delete="deleteWorkDraft"></works-column>
        <works-column :works="shares.mobiles" @share-info="goShareLink" @play="playWork" @delete="deleteWorkDraft"></works-column>
        <works-column :works="shares.books" @share-info="goShareLink" @play="playWork" @delete="deleteWorkDraft"></works-column>
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
import WorkCover from './components/WorkCover'
import WorksColumn from './components/WorksColumn'

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
      this.drafts.widescreens = result.list.filter(work => work.ratio === '16:9' && work.isDraft)
      this.drafts.mobiles = result.list.filter(work => work.ratio === '9:16' && work.isDraft)
      this.drafts.books = result.list.filter(work => work.ratio === '4:3' && work.isDraft)
      this.shares.widescreens = result.list.filter(work => work.ratio === '16:9' && !work.isDraft)
      this.shares.mobiles = result.list.filter(work => work.ratio === '9:16' && !work.isDraft)
      this.shares.books = result.list.filter(work => work.ratio === '4:3' && !work.isDraft)
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
      window.open('/play/auto/' + work._id)
    },
    chooseFromTemplateWork () {

    },
    chooseDraftWork (work) {
      this.$router.push(this.xdUrl + '?ratio=' + work.ratio + '&work=' + work._id)
    },
    chooseStartWork (ratio) {
      this.$router.push(this.xdUrl + '?ratio=' + ratio + '&work=new')
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
