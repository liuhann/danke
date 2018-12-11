<template>
<div class="designer mobile">
  <div class="scene">
    <scene v-if="currentScene" :scene="currentScene" :device="{}"></scene>
  </div>

  <div class="prop-panel">

  </div>

  <div class="floating-buttons">
    <van-icon class="menu" name="wap-nav" @click="showWorkMenu=true"/>
    <van-icon name="add" v-if="currentScene" @click="showAddElement=true"/>
  </div>

  <van-popup v-model="showAddElement" class="pop-select-element" position="center" :overlay="true">
    <choose-add-element @selected="selectAddElement"></choose-add-element>
  </van-popup>

  <van-popup v-model="showWorkMenu" class="setting" position="right" :overlay="true">
    <van-cell>菜单</van-cell>
    <van-panel>
      <div class="scene-list">
        <scene :scene="scene" :device="{width: '12vw', height: '22vw'}" v-for="(scene, index) in scenes" :key="index"></scene>
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
import ChooseAddElement from './ChooseAddElement'
import utils from '../utils/util'
import { Popup, Icon, Button, Cell, CellGroup, Panel, Stepper, Collapse, CollapseItem } from 'vant'

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
    ChooseAddElement,
    'van-popup': Popup,
    'van-button': Button,
    'van-icon': Icon,
    'van-cell': Cell,
    'van-cell-group': CellGroup,
    'van-panel': Panel,
    'van-stepper': Stepper,
    Collapse,
    CollapseItem
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
    },
    selectAddElement (elementName) {
      this.showAddElement = false
      this.currentScene.elements.push({
        type: elementName,
        width: '30vw',
        height: '30vw',
        x: '20vw',
        y: '20vw'
      })
    },
    addElement () {

    },
    updateElement () {

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
    .menu {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
  .van-popup.setting {
    width: 88vw;
    height: 100vh;
  }

  .setting {
    .scene-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      overflow-y: auto;
      .scene {
        margin:1vw;
        border-radius: 5px;
        border: 1px solid #ccc;
      }
    }
  }
}

</style>
