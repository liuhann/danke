<template>
<div id="page-scene-list">
  <nav-bar></nav-bar>
  <div class="section">
    <div class="container">
      <div class="buttons has-addons group-btn-type">
        <a v-for="type in createMenus" :key="type.ratio" class="button is-small" :class="[screenType===type.ratio? 'is-selected is-info':'']"
              @click="setScreenType(type.ratio)">
          <span class="icon">
            <i :class="type.icon"></i>
          </span>
          <span>{{type.label}}</span>
        </a>
      </div>
    </div>
  </div>
  <section class="section scene-list">
    <div class="container">
      <div class="columns is-mobile is-multiline">
        <div class="column is-one-fifth-fullhd is-one-quarter-widescreen is-one-quarter-desktop is-one-third-tablet is-half-mobile is-vcentered" @click="addSceneClicked">
          <div class="add-empty">
            <i class="icon-plus"></i>
          </div>
        </div>
        <div class="column is-one-fifth-fullhd is-one-quarter-widescreen is-one-quarter-desktop is-one-third-tablet is-half-mobile is-vcentered"
             v-for="(scene, index) in scenes" :key="scene._id">
          <div class="device">
            <page-play :device="getDevice(scene.screen)" :scene="scene" ref="pagePlay"></page-play>
						<span class="button is-small is-primary" @click="replay(scene, index)"></span>
            <span class="button icon-edit is-small is-primary" @click="editScene(scene)"></span>
            <span class="button icon-trash is-small is-danger" @click="deleteScene(scene)"></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
</template>

<script>
import './fontello/css/fontello.css'
import NavBar from '../common/site/NavBar'
import ratios from './utils/ratios'
import DropDownMenu from '../common/components/DropDownMenu'
import RestDAO from '../common/dao/restdao'
import PagePlay from './PagePlay'

const sizes = {
  '9:16': 480,
  '16:9': 240,
  '4:3': 320
}
const screenDevices = {
  '9:16': {
    width: 240,
    height: 450
  },
  '4:3': {
    width: 240,
    height: 180
  },
  '16:9': {
    width: 240,
    height: 180
  }
}

export default {
  name: 'PageList',
  components: { PagePlay, DropDownMenu, NavBar },
  data () {
    return {
      screenType: '9:16',
      total: 0,
      page: 1,
      count: 20,
      sizes,
      scenes: [],
      createMenus: ratios,
      screenDevices
    }
  },

  computed: {
    boxHeight () {
      if (window.innerWidth > 1088) {
        return ((window.innerWidth - 128) / 3) - 64
      } else {
        return window.innerWidth - 64
      }
    },
    containerStyle () {
      return {
        height: this.boxHeight + 'px'
      }
    }
  },
  created () {
    this.scenedao = new RestDAO(this.ctx, 'danke/scene')
  },

  mounted () {
    this.loadMoreScenes()
  },

  methods: {
    getDevice (ratioStr) {
      return this.screenDevices[ratioStr]
    },

    async loadMoreScenes () {
      const result = await this.scenedao.list({
        screen: this.screenType,
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

    editScene (scene) {
      this.$router.push(`/builder/scene/${scene._id}/${scene.screen}`)
    },

    replay (scene, index) {
			this.$refs.pagePlay[index].replay()
		},
    async deleteScene (scene) {
      await this.scenedao.delete(scene)
    },

    addSceneClicked () {
      this.$router.push('/builder/scene/new/' + this.screenType)
    }
  }
}
</script>

<style lang="scss">
#page-scene-list {
  .scene-list {
    .add-empty {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px dashed #ddd;
      border-radius: 20px;
      font-size: 1.5rem;
      cursor: pointer;
      color: #ddd;
      &:hover {
        color: #666;
      }
    }
    .device {
      background-color: white;
      width: 240px;
      border: 1px solid #efefef;
      overflow: hidden;
      position: relative;
      cursor: pointer;

      .button {
        position: absolute;
        bottom: 10px;
        z-index: 11111;
        display: none;
      }
      .icon-edit {
        right: 60px;
      }
      .icon-trash {
        right: 10px;
      }
      &:hover {
        .button {
          display: initial;
        }
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
      }
    }
  }
}
</style>
