<template>
<div id="site">
  <nav-bar></nav-bar>
  <div class="main-full loading" v-if="loading">
    <ol class="shots-grid container-fluid">
      <li class="work-loading" v-for="n in 24" :key="n" :style="{
        height: '240px'
      }"></li>
    </ol>
  </div>
  <div class="main-full">
    <ol class="shots-grid container-fluid">
      <li v-for="work in works" :key="work._id">
        <div class="scene-wrapper" :style="{
            width: workViewPort.width + 'px',
            height: workViewPort.height + 'px'
        }">
          <render-scene :view-box="work.viewBox || work.screen" :scene="work.scenes[0]" :view-port="work.viewport" :stage="work.stage"/>
        </div>
        <div class="author-likes">
          <img class="avatar" v-if="work.avatar" :src="getImageUrl(work.avatar, 24, 24)">
          <div class="author">
            {{work.author}}
          </div>
        </div>
      </li>
    </ol>
  </div>

  <nav-footer />
</div>
</template>
<script>
import NavBar from './components/NavBar'
import NavFooter from './components/NavFooter'
import RestDAO from '../common/dao/restdao'
import StyleRegistry from '../xd-builder/utils/StyleRegistry'
import { fitRectIntoBounds } from '../xd-builder/mixins/rectUtils'
import RenderScene from '../xd-builder/render/RenderScene'
import { getImageUrl } from '../xd-builder/mixins/imageUtils'

export default {
  name: 'Main',
  components: { RenderScene, NavFooter, NavBar },
  data () {
    return {
      works: [],
      loading: true,
      workViewPort: {
        width: 100,
        height: 100
      }
    }
  },
  computed: {
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.svgdao = new RestDAO(this.ctx, 'danke/svg')
    this.ctx.styleRegistry = new StyleRegistry()
  },
  mounted () {
    this.initWorkViewPort()
    this.loadWorks()
  },
  methods: {
    avatar () {
      if (this.user && this.user.avatar) {
        return this.getImageUrl(this.user.avatar, 96, 96)
      } else {
        return 'http://cdn.danke.fun/res/head.svg'
      }
    },
    getImageUrl,
    initWorkViewPort () {
      const loadingBlock = document.querySelector('.work-loading')
      this.workViewPort = {
        width: loadingBlock.getBoundingClientRect().width,
        height: loadingBlock.getBoundingClientRect().width / 4 * 3
      }
    },

    async loadWorks () {
        const result = await this.workdao.list({
          'system.site': 'on',
          'projection': 'scenes.1,name,id,frames,viewBox,nick,avatar,title,author'
        })

        const svgs = []
        for (let work of result.list) {
          work.scenes[0].elements.forEach( element=> {
            if (element.svg) {
              svgs.push(element.svg)
            }
          })
          work.stage = 'enter'

          if (work.frames) {
            this.ctx.styleRegistry.addFrames(work.frames)
          }
        }
        const svgRes = await this.svgdao.multiGet(svgs)
        for (let res of svgRes.list) {
          this.ctx.styleRegistry.addVector(res)
        }
        this.works = result.list
        for (let work of this.works) {
          work.viewport = fitRectIntoBounds(work.viewBox || {
            width: 300,
            height: 200
          }, this.workViewPort)
          console.log(work.viewport)
        }
        this.loading = false
        // this.lines = flowSchedule(this.works, this.$refs.myWorkList.offsetWidth, 25, 256)
    },
  }
}
</script>

<style lang="scss">
.shots-grid {
  margin-top: 108px;
  display: grid;
  list-style: none;
  grid-gap: 36px;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  .scene-wrapper {
    overflow: hidden;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 5px 0px rgba(62,66,66,0.13);
  }
  .scene {
    position: relative;
    overflow: hidden;
    .element {
      position: absolute;
    }
  }
}

.author-likes {
  margin: 10px 0;
  display: flex;
  img.avatar {
    border-radius: 50%;
  }
  .author {
    margin-left: 10px;
    color: #3d3d4e;
    font-weight: bold;
    line-height: 22px;
  }
}
.container-fluid {
  padding-left: 20px;
  padding-right: 20px;
}

@media (min-width: 768px) {
  .container-fluid {
    padding-left: 32px;
    padding-right: 32px;
  }
}

@media (min-width: 1200px) {
  .container-fluid {
    padding-left: 72px;
    padding-right: 72px;
  }
}
@media (min-width: 1600px) {
  .container-fluid {
    padding-left: 72px;
    padding-right: 72px;
  }
  .shots-grid {
    grid-template-columns: repeat(auto-fill, minmax(336px, 1fr));
  }
}
</style>
