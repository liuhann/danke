<template>
  <div id="addon-html-list" class="left-aside-content">
    <el-tabs v-model="currentAlbum" @tab-click="albumChange">
      <el-tab-pane name="基础" label="基础" />
      <el-tab-pane v-for="album in albums" :key="album" :name="album" :label="album" />
    </el-tabs>
    <div class="left-block">
      <div v-if="currentAlbum === '基础'" class="block-list">
        <div
          v-for="(shape, index) in shapes"
          :key="index"
          class="object-item" draggable @dragstart="dragStart(shape, $event)"
        >
          <div class="shape" :style="shapeStyle(shape)" />
        </div>
      </div>

      <div v-if="currentAlbum !== '基础'" class="block-list">
        <div
          v-for="(svg, index) in svgs"
          :key="index"
          class="object-item" draggable @dragstart="dragStart(svg, $event)"
        >
          <div class="svg-container" :style="variableValues(svg)">
            <div class="styled-box" v-html="svg.content">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { assignVariables} from '../mixins/renderUtils'
import { Pagination, Input, Button, Loading, Checkbox, Tabs, TabPane } from 'element-ui'
import RestDAO from '../../utils/restdao.js'
import shapes from './shapes'

export default {
  name: 'HtmlElementList',
  components: {
    [Input.name]: Input,
    [Pagination.name]: Pagination,
    [Checkbox.name]: Checkbox,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    [Button.name]: Button
  },
  mixins: [ ],
  data () {
    return {
      albums: [],
      currentAlbum: '',
      shapes,
      svgs: []
    }
  },
  created () {
    this.svgdao = new RestDAO(this.ctx, 'danke/svg')
  },
  mounted () {
    this.loadSvgs()
    this.currentAlbum = '基础'
  },
  methods: {
    async loadSvgs() {
      const result = await this.svgdao.distinct('album')
      this.albums = result
    },

    async albumChange () {
      const result = await this.svgdao.list({
        album: this.currentAlbum
      })
      this.svgs = result.list
    },
    shapeStyle (shape) {
      const style = Object.assign({}, shape.style)
      assignVariables(style, shape.variables)
      return style
    },

    variableValues (svg) {
      const styles = {}
      assignVariables(styles, svg.variables)
      return styles
    },

    dragStart (shape, ev) {
      ev.dataTransfer.setData('Text', JSON.stringify(shape))
    }
  }
}
</script>

<style lang="scss">
@import './common.scss';
#addon-html-list {
  .svg-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .styled-box {
      width: 80%;
      height: 80%;
      z-index: 10;
      position: relative;
      svg {
        width: 100%;
        height: 100%;
      }
    }
  }

}
</style>
