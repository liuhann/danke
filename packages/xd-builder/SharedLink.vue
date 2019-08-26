<template>
<div id="page-work-shared">
  <nav-bar/>
  <section class="section main">
    <div class="container">
      <div class="columns">
        <div class="column preview is-two-thirds" ref="columnLeft">
          <work-cover v-if="work" v-show="!isPlaying" :work="work" :ratio="work.ratio" @play="play"></work-cover>
          <player v-if="work" v-show="isPlaying" :work="work"></player>
        </div>
        <div class="column detail">
          <h4 class="work-title">{{work.title}}</h4>
          <p class="author">来自：<span>{{work.creator}}</span></p>
          <div class="site-info-like">
            <div class="like">
              <a onclick="like(work)" title="click to like">
                <i class="fa fa-heart"></i>
              </a> <span > {{22}} </span> </div>
            <div class="view">
              <i class="icon-eye" style="color: #2c74c4"></i> 55</div>
          </div>
          <small>Categories</small>
          <div class="categories">
            <a class="category" v-for="(cat,index) in work.categories" :key="index">{{cat}}</a>
          </div>
          <small>URL</small>
          <div id="QRCode"></div>
        </div>
      </div>
    </div>
  </section>
  <nav-footer></nav-footer>
</div>

</template>

<script>
import NavFooter from '../site/components/NavFooter'
import NavBar from '../site/components/NavBar'
import RestDAO from '../common/dao/restdao'
import WorkCover from './components/WorkCover'
import Player from '../xd-player/Player.vue'
export default {
  name: 'SharedLink',
  components: { WorkCover, NavBar, NavFooter, Player },
  data () {
    return {
      work: null,
      isPlaying: false
    }
  },

  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },

  mounted () {
    this.loadWork()
  },
  methods: {
    async loadWork () {
      this.work = await this.workdao.getOne(this.$route.params.link)
    },
    play () {
      this.isPlaying = true
    },
    async like (work) {

    }
  }
}
</script>

<style lang="scss">
#page-work-shared {
  .section.main {
    margin-top: 20px;
    margin-bottom: 20px;
    .preview {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 640px;
    }
    .column.detail {
      padding-left: 40px;
      .work-title {
        font-size: 1.5rem;
        margin-bottom: .2rem;
      }
    }

    .site-info-like {
      padding-top: 15px;
      .like, .view {
        margin-right: 20px;
        display: inline-block;
        vertical-align: top;
        font-size: 1.5rem;
      }
    }
  }

  small {
    display: block;
    font-size: 14px;
    text-transform: uppercase;
    padding: 30px 0 5px 0;
  }
}

</style>
