<template>
<div class="welcome">
  <nav-bar></nav-bar>
  <section class="section splash">
    <div class="container">
    </div>
  </section>
  <section class="section create-work">
    <div class="container">
      <div class="welcome-title">从空白创建新的作品</div>
      <div class="start-new-container">
        <div class="device-type-list">
          <div class="device-type" @click="chooseStartWork('9:16')">
            <i class="icon-mobile-1"></i>
            <div class="desc">手机</div>
          </div>
          <div class="device-type" @click="chooseStartWork('4:3')">
            <i class="icon-tablet-1 rotate90"></i>
            <div class="desc">平板</div>
          </div>
          <div class="device-type" @click="chooseStartWork('16:9')">
            <i class="icon-laptop"></i>
            <div class="desc">桌面</div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="welcome-title">使用模板创建</div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="welcome-title">打开草稿</div>
    </div>
    <ul class='work-list'>
      <li class="work-item" :class="choosedWork.id===work.id?'current': ''" v-for="work in draftWorks" :key="work.id" @click="chooseDraftWork(work)">
        <div class="work-title">{{work.title}}</div>
        <div class="updated">{{formateTime(work.updated)}}</div>
        <div class="operation"><i class="icon-trash-empty" @click="deleteWorkDraft(work)"></i></div>
      </li>
    </ul>
  </section>
</div>
</template>

<script>
import NavBar from '../site/components/NavBar'
import RestDAO from '../common/dao/restdao'
import dayjs from 'dayjs'
export default {
  name: 'Welcome',
  components: {
    NavBar
  },
  data () {
    return {
      choosedWork: {},
      draftWorks: []
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
      this.$router.push('/xd?ratio=' + work.ratio + '&work=' + work._id)
    },
    chooseStartWork (ratio) {
      this.$router.push('/xd?ratio=' + ratio + '&work=new')
    },
    formateTime (mill) {
      return dayjs(mill).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="scss">
.welcome-title {
  font-size: 1.25rem;
  color: #333;
  padding: .25rem 1rem;
}
.rotate90 {
  transform: rotate(90deg);
}
.device-type-list {
  display: flex;
  height: 9rem;
  .device-type {
    cursor: pointer;
    width: 160px;
    flex-direction: column;
    display: flex;
    align-items: center;
    border-radius: 8px;
    margin: 10px;
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
