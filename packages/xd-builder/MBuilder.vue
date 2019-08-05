<template>
  <div id="xd">
    <top-bar></top-bar>
    <tool-bar :vertical="false"></tool-bar>
    <transition name="slide-left">
      <left-toggle-menu v-if="showLeftToggleMenu" @menu-clicked="showLeftToggleMenu = false"></left-toggle-menu>
    </transition>
    <div class="scene-container" ref="sceneContainer">
      <div class="device" ref="device" v-if="currentScene" :style="currentScene.style" @click.self="sceneClick">
        <div v-for="(element, index) of currentScene.elements" :key="element.id" :id="'element-' + element.id"
             class="element" :class="[element.visible?'':'hidden', 'type' + element.type]" :style="element.style + ';' + 'z-index:' + index + ';'"
             @click="chooseElement(element, $event)">
          <img v-if="element.type === TypeEnum.IMAGE || element.type === TypeEnum.SVG" :src="element.url">
          <span v-if="element.type === TypeEnum.TEXT && element!==currentElement" v-html="$options.filters.newline(element.text)"></span>
        </div>
      </div>
    </div>
    <drawer :visible.sync="elementDialogVisible" size="360" :show-close="false">
      <span slot="title"></span>
      <element-config :element="currentElement" v-if="currentElement"></element-config>
    </drawer>
    <full-player v-if="playing" :ratio="playingWork.ratio" :work="playingWork"></full-player>
  </div>
</template>

<script>
import elementMixin from './mixins/elementMixins'
import saveShareMixin from './mixins/saveShare'
import sceneMixin from './mixins/sceneMixins'
import layoutMixin from './mixins/layoutMixin'
import keyBindMixin from './mixins/key-binds'
import initMixin from './mixins/init'
import dataProvideMixin from './mixins/dataProvides'
import TopBar from './components/TopBar'
import LeftToggleMenu from './components/LeftToggleMenu'
import ToolBar from './components/ToolBar'
import FullPlayer from './components/FullPlayer'
import ElementConfig from './components/ElementConfig'

import { Drawer } from 'element-ui'
export default {
  name: 'MBuilder',
  components: { ElementConfig, FullPlayer, ToolBar, LeftToggleMenu, TopBar, Drawer },
  mixins: [initMixin, elementMixin, saveShareMixin, sceneMixin, keyBindMixin, layoutMixin, dataProvideMixin],
  data () {
    return {
      elementDialogVisible: false,
      interactEnabled: false,
      devicePadding: [10, 10]
    }
  },
  mounted () { },
  methods: {
    sceneClick () {
      this.hideLeftToggleMenu()
      this.chooseElement(null)
    },
    elementChoosed () {
      if (this.currentElement) {
        this.elementDialogVisible = true
      }
    }
  }
}
</script>

<style lang="scss">
.el-drawer__header {
  display: none;
}
@import './common.scss';
#xd {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f4;
  .tool-bar {
    position: absolute;
    z-index: 1001;
    left: 5px;
    bottom: 5px;
    right: 5px;
    background-color: rgba(255, 255, 255, .4);
  }
  .scene-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 38px;
    bottom: 0;
    overflow: auto;
    .device {
      -ms-touch-action: none;
      touch-action: none;
    }
  }
}
</style>
