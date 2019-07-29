<template>
  <div id="xd">
    <top-bar></top-bar>
    <transition name="slide-left">
      <left-toggle-menu v-if="showLeftToggleMenu" @menu-clicked="showLeftToggleMenu = false"></left-toggle-menu>
    </transition>
    <div class="scene-container" ref="sceneContainer">
      <div class="inner-container">
        <div class="device" ref="device" v-if="currentScene" :style="currentScene.style" @click.self="sceneClick">
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import elementMixin from './mixins/elementMixins'
import saveShareMixin from './mixins/saveShare'
import sceneMixin from './mixins/sceneMixins'
import sceneContainer from './mixins/sceneContainer'
import keyBindMixin from './mixins/key-binds'
import dataProvideMixin from './mixins/dataProvides'
import TopBar from './components/TopBar'
import LeftToggleMenu from './components/LeftToggleMenu'
export default {
  name: 'MBuilder',
  components: { LeftToggleMenu, TopBar },
  mixins: [elementMixin, saveShareMixin, sceneMixin, keyBindMixin, sceneContainer, dataProvideMixin],
  data () {
    return {
      interactEnabled: false,
      devicePadding: [10, 10]
    }
  },
  methods: {
    sceneClick () {
      this.hideLeftToggleMenu()
      this.chooseElement(null)
    }
  }
}
</script>

<style lang="scss">
#xd {
  @import './common.scss';
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f4;
  .scene-container {
    .inner-container {
      padding: 200px;
      height: 2000px;
      width: 2000px;
    }
    position: absolute;
    left: 0;
    right: 0;
    top: 38px;
    bottom: 0;
    overflow: auto;
  }
}
</style>
