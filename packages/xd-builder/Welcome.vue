<template>
<div class="welcome">
  <nav-bar></nav-bar>
  <section class="section">
    <div class="container">
      <h4 class="subtitle is-6">创建新的作品</h4>
      <tabs v-model="startNav" :tabs="tabs" size="is-small"></tabs>
      <div class="columns is-mobile is-multiline is-1" v-if="startNav === 'widescreen'">
        <div class="column is-half-mobile is-one-quarter-tablet" @click="chooseStartWork('16:9')">
          <div class="add-work">
            <i class="icon-plus-1"></i>
          </div>
        </div>
        <div class="column is-half-mobile is-one-quarter-tablet" v-for="work in templates.widescreens" :key="work.id">
          <work-cover :work="work" :ratio="work.ratio"></work-cover>
        </div>
      </div>
      <div class="columns is-mobile is-multiline is-1" v-if="startNav === 'mobile'">
        <div class="column is-one-third-mobile is-2-tablet" @click="chooseStartWork('9:16')">
          <div class="add-work">
            <i class="icon-plus-1"></i>
          </div>
        </div>
        <div class="column is-one-third-mobile is-2-tablet" v-for="work in templates.mobiles" :key="work.id">
          <work-cover :work="work" :ratio="work.ratio"></work-cover>
        </div>
      </div>
      <div class="columns is-mobile is-multiline is-1" v-if="startNav === 'tablet'">
        <div class="column is-half-mobile is-2-tablet" @click="chooseStartWork('4:3')">
          <div class="add-work">
            <i class="icon-plus-1"></i>
          </div>
        </div>
        <div class="column is-half-mobile is-2-tablet" v-for="work in templates.books" :key="work.id">
          <work-cover :work="work" :ratio="work.ratio"></work-cover>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <h4 class="subtitle is-6">打开草稿</h4>
      <div class="columns is-mobile is-multiline is-1">
        <div class="column is-half-mobile is-one-quarter-tablet" v-for="work in drafts.widescreens" :key="work.id" @click="chooseDraftWork(work)">
          <work-cover :work="work" :ratio="work.ratio"></work-cover>
          <div class="work-info">
            <div class="work-title">
              {{work.title}}
            </div>
            <div class="operation"><i class="icon-trash-empty" @click="deleteWorkDraft(work)"></i></div>
          </div>
        </div>
      </div>

      <div class="columns is-mobile is-multiline is-1">
        <div class="column is-one-third-mobile is-2-tablet" v-for="work in drafts.mobiles" :key="work.id" @click="chooseDraftWork(work)">
          <work-cover :work="work" :ratio="work.ratio"></work-cover>
          <div class="work-info">
            <div class="work-title">
              {{work.title}}
            </div>
            <div class="operation"><i class="icon-trash-empty" @click="deleteWorkDraft(work)"></i></div>
          </div>
        </div>
      </div>

      <div class="columns is-mobile is-multiline is-1">
        <div class="column is-half-mobile is-2-tablet" v-for="work in drafts.books" :key="work.id" @click="chooseDraftWork(work)">
          <work-cover :work="work" :ratio="work.ratio"></work-cover>
          <div class="work-info">
            <div class="work-title">
              {{work.title}}
            </div>
            <div class="operation"><i class="icon-trash-empty" @click="deleteWorkDraft(work)"></i></div>
          </div>
        </div>
      </div>

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
    WorkCover,
    Tabs,
    NavBar
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
      return this.isMobile? '/xdm': '/xd'
    }
  },
  filters: {
    displayRatio (r) {
      return welcomeRatios[r] || '1:1'
    },
    textAdjust (r) {
      return textAdjusts[r] || 3
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
      this.drafts.widescreens = result.list.filter( work => work.ratio === '16:9')
      this.drafts.mobiles = result.list.filter( work => work.ratio === '9:16')
      this.drafts.books = result.list.filter( work => work.ratio === '4:3')
    },

    async loadTops () {
      const tops = await this.workdao.list({
        'system.top4': '1'
      })
      this.templates.widescreens = tops.list.filter( work => work.ratio === '16:9')
      this.templates.mobiles = tops.list.filter( work => work.ratio === '9:16')
      this.templates.books = tops.list.filter( work => work.ratio === '4:3')
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
