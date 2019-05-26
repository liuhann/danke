<template>
<section class="section page-scene-list">
  <nav-bar></nav-bar>
  <nav class="level">
    <div class="level-left">
      <drop-down-menu :menus="createMenus" @menu-clicked="menuClicked">
        <span class="button icon-plus">增加</span>
      </drop-down-menu>
    </div>
    <div class="level-right buttons has-addons">
      <span class="button" @click="setScreenType('')">全部</span>
        <span v-for="type in createMenus" :key="type.ratio" class="button" :class="[screenType===type.ratio? 'is-selected is-info':'', type.icon]"
              @click="setScreenType(type.ratio)"></span>
    </div>
  </nav>
  <div class="columns is-variable is-1 is-multiline is-mobile is-tablet">
    <div class="column scene-item is-one-third-widescreen is-one-third-tablet is-half-mobile" v-for="(scene, index) in scenes" :key="index">
      <div class="preview-container">
        <div class="device">
          <page-play :device="getDevice(scene.screen)" :scene="scene"></page-play>
        </div>
      </div>
      <div class="intro"></div>
    </div>
  </div>
</section>
</template>

<script>
import './fontello/css/fontello.css'
import NavBar from '../common/site/NavBar'
import ratios from './utils/ratios'
import DropDownMenu from '../common/components/DropDownMenu'
import RestDAO from '../common/dao/restdao'
import PagePlay from './PagePlay'
export default {
  name: 'PageList',
  components: {PagePlay, DropDownMenu, NavBar },
  data () {
    return {
      screenType: '',
      total: 0,
      page: 1,
      count: 20,
      scenes: [],
      createMenus: ratios
    }
  },

  computed: {
    device () {

    }
  },

  created () {
    this.scenedao = new RestDAO(this.ctx, 'danke/scene')
  },

  mounted () {
    this.loadMoreScenes()
  },

  methods: {
    getDevice (type) {
      if (type === '9:16') {
        return {
          width: 200,
          height: 400
        }
      } else if (type === '4:3') {
        return {
          width: (window.innerWidth - 60)/ 3,
          height: (window.innerWidth - 60 )/4
        }
      } else {
        return {
          width: 200,
          height: 400
        }
      }

    },
    async loadMoreScenes () {
      const result = await this.scenedao.list({
        page: this.page,
        count: this.count
      })
      this.scenes = result.list
      this.total = result.total
    },

    setScreenType (type) {
      this.screenType = type
      this.scenes = []
      this.total = 0
      this.page = 1
      this.loadMoreScenes()

    },
    menuClicked (menu) {
      this.$router.push('/page-tool/new/' + menu.ratio)
    }
  }
}
</script>

<style lang="scss">
.page-scene-list {
  .columns {
    margin: 0;
    .column {
      padding: 0;
    }

    .scene-item {
      background-color: rgba(0,0,0,.05);
    }
    .preview-container {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      .device {

      }
    }
  }
}
</style>
