<template>
<div class="welcome">
  <nav-bar></nav-bar>
  <section class="section splash">
    <div class="container">
      <div class="welcome-title">
        <span>使用模板创建</span>
        <div class="button is-small is-pulled-right is-plain">更多</div>
      </div>
      <div class="columns is-mobile is-multiline">
        <div class="column is-half-mobile">
          <div class="cover" @click="chooseDraftWork()">
          </div>
        </div>
        <div class="column is-half-mobile">
          Second column
        </div>
        <div class="column is-half-mobile">
          Third column
        </div>
        <div class="column is-half-mobile">
          Fourth column
        </div>
      </div>
    </div>
  </section>
  <section class="section create-work">
    <div class="container">
      <div class="welcome-title">
        <span>从空白创建新的作品</span>
      </div>
      <div class="start-new-container">
        <div class="device-type-list columns is-mobile">
          <div class="device-type column is-one-third-mobile is-one-fifth-tablet" @click="chooseStartWork('9:16')">
            <i class="icon-mobile-1"></i>
            <div class="desc">手机</div>
          </div>
          <div class="device-type column is-one-third-mobile is-one-fifth-tablet" @click="chooseStartWork('4:3')">
            <i class="icon-tablet-1 rotate90"></i>
            <div class="desc">平板</div>
          </div>
          <div class="device-type column is-one-third-mobile is-one-fifth-tablet" @click="chooseStartWork('16:9')">
            <i class="icon-laptop"></i>
            <div class="desc">桌面</div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="welcome-title">打开草稿</div>
      <ul class='work-list'>
        <li class="work-item" v-for="work in draftWorks" :key="work.id" >
          <div class="cover" @click="chooseDraftWork(work)">
            <work-cover :work="work" :ratio="work.ratio | displayRatio" :height="260" :text-adjust="work.ratio | textAdjust"></work-cover>
          </div>
          <div class="work-info">
            <div class="work-title">
              {{work.title}}
            </div>
            <div class="operation"><i class="icon-trash-empty" @click="deleteWorkDraft(work)"></i></div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</div>
</template>

<script>
import { MessageBox } from 'element-ui'
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
    NavBar
  },
  data () {
    return {
      isMobile: screen.width < screen.height,
      templates: {
        tablets: [],
        mobiles: []
      },
      draftWorks: []
    }
  },
  computed: {
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
  },
  methods: {
    async loadDraftWorks () {
      const result = await this.workdao.list()
      this.draftWorks = result.list
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
.welcome-title {
  font-size: 1rem;
  color: #333;
  padding: .25rem .5rem;
  height: 2.5rem;
  margin: 1rem 0;
}
.rotate90 {
  transform: rotate(90deg);
}
.work-list {
  display: flex;
  flex-wrap: wrap;
  .work-item {
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
.device-type-list {
  height: 9rem;
  .device-type {
    cursor: pointer;
    flex-direction: column;
    display: flex;
    align-items: center;
    border-radius: 8px;
    &:hover {
      border: 1px solid #00bf72;
      i {
        color: #47b17c;
        transform: scale(1.6);
        &.rotate90 {
          transform: scale(1.6) rotate(90deg);
        }
      }
      .desc {
        color: #47b17c;
      }
    }
    i {
      transition: transform .2s ease-in;
      margin-top: 2rem;
      font-size: 2.5rem;
      color: #7a7a7a;
    }
    .desc {
      font-size: .8rem;
      width: 8rem;
      text-align: center;
    }

    &.checked {
      background-color: #00bf72;
      i {
        color: #fff;
        transform: scale(1.6);
      }
      .desc {
        color: #fff
      }
    }
  }
}
</style>
