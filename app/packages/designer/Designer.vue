<template>
<div class="designer mobile">
  <div class="scene">
    <scene v-if="currentScene" :scene="currentScene" :device="{}"></scene>
  </div>

  <div class="prop-panel">

  </div>

  <div class="floating-buttons">
    <van-icon name="wap-nav" @click="showWorkMenu=true"/>
    <van-icon name="add" v-if="currentScene" @click="showAddElement=true"/>
  </div>

  <van-popup v-model="showAddElement" class="pop-select-element" position="center" :overlay="true">
    <div class="element-list">
      <van-icon name="photo"></van-icon>
    </div>
  </van-popup>

  <van-popup v-model="showWorkMenu" class="setting" position="right" :overlay="true">
    <van-cell>设置</van-cell>
    <van-panel title="场景列表">
      <div class="scene-list">
        <div class="scene-preview-wrapper"  v-for="(scene, index) in scenes" :key="index">
          <scene :scene="scene" :device="{width: '18vw', height: '32vw'}"></scene>
        </div>
      </div>
      <div slot="footer">
        <van-button size="mini" icon="add" @click="addEmptyScene">增加</van-button>
      </div>
    </van-panel>
    <van-panel title="场景配置"  v-if="currentScene">
      <div slot="footer">
        <van-button size="mini" icon="add" @click="addEmptyScene">保存</van-button>
      </div>
    </van-panel>
  </van-popup>

</div>
</template>

<script>
import Scene from './Scene'
import utils from '../utils/util'
import { Popup, Icon, Button, Cell, CellGroup, Panel, Stepper } from 'vant'

const SCENE_TEMPLATE = {
  'template': 'designed',
  'hideDelay': 2000,
  'triggerClose': 3000,
  'elements': []
}

export default {
  name: 'Designer',
  components: {
    Scene,
    'van-popup': Popup,
    'van-button': Button,
    'van-icon': Icon,
    'van-cell': Cell,
    'van-cell-group': CellGroup,
    'van-panel': Panel,
    'van-stepper': Stepper
  },
  data () {
    return {
      currentScene: null,
      showWorkMenu: false,
      showAddElement: false,
      scenes: [],
      workMenu: ['1'],
      pageConfig: {
      }
    }
  },
  methods: {
    addEmptyScene () {
      this.scenes.push(utils.clone(SCENE_TEMPLATE))
      this.currentScene = this.scenes[this.scenes.length - 1]
    }
  }
}
</script>

<style lang="less">
.designer.mobile {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;

  .floating-buttons {
    .van-icon {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 29px;
    }
  }
  .van-popup.setting {
    width: 80vw;
    height: 98vh;
  }

  .setting {
    .scene-list {
      display: flex;
      flex-direction: row;
      height: 36vw;
      overflow-y: auto;
      .scene-preview-wrapper {
        float: left;
        padding: 2vw 1vw;
        .scene {
          border: 1px solid #ccc;
        }
      }
    }
  }
}

</style>
