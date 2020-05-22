<template>
<div id="scene-list">
  <div class="actions">
    <el-button type="primary" size="mini" @click="addScene">新增场景</el-button>
    <el-button type="primary" size="mini" v-if="checkedScenes.length">复制</el-button>
    <el-button type="danger" size="mini" @click="deleteScene" v-if="checkedScenes.length">删除</el-button>
    <el-button size="mini" @click="close">关闭</el-button>
  </div>
  <div class="list-wrapper">
    <div v-for="scene in work.scenes" :key="scene._id" class="scene-wrapper" :class="(scene === current || scene.checked)? 'current': ''" :style="{
      width: viewPort.width + 'px',
      height: viewPort.height + 'px'
    }" >
      <el-checkbox v-model="scene.checked"/>
      <div @click="chooseScene(scene)">
        <render-scene :scene="scene" :view-box="work.viewBox" :view-port="viewPort"/>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import { Button, Checkbox, MessageBox } from 'element-ui'
import sceneMixins from './mixins/sceneMixins'
import RenderScene from './render/RenderScene'
export default {
  name: 'SceneList',
  mixins: [ sceneMixins ],
  components: {
    RenderScene,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox
  },
  props: {
    work: {
      type: Object
    },
    current: {
      type: Object
    }
  },
  computed :{
    viewPort () {
      return {
        height: 120,
        width: 120 * this.work.viewBox.width / this.work.viewBox.height
      }
    },
    checkedScenes () {
      return this.work.scenes.filter(scene => scene.checked)
    }
  },
  methods: {
    deleteScene () {
      if (this.work.scenes.length === this.checkedScenes.length) {
        MessageBox.prompt('不能将所有场景删除，请至少保留一个场景')
        return
      }
      this.work.scenes = this.work.scenes.filter(scene => !scene.checked)
    },

    chooseScene (scene) {
      this.$emit('choose-scene', scene)
      this.$emit('close')
    },
    close () {
      if (this.work.scenes.filter(scene => scene === this.current).length === 0) {
        this.$emit('choose-scene', this.work.scenes[0])
      }
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
#scene-list {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  background-color: rgba(255, 255, 255, .96);
  .actions {
    height: 40px;
    line-height: 36px;
    padding: 0 20px;
    background: #fff;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0 2px;
  }

  .list-wrapper {
    padding: 10px;
  }
  .scene-wrapper {
    float: left;
    margin: 5px;
    position: relative;
    border: 2px solid #CCC;
    border-radius: 5px;
    &:hover, &.current {
      cursor: pointer;
      border: 2px solid #00bf72;
    }
    .el-checkbox {
      position: absolute;
      right: 5px;
      top: 5px;
      .el-checkbox__input.is-checked .el-checkbox__inner {
        background: #00bf72;
      }
    }
    .scene {
      position: relative;
      .element {
        position: absolute;
      }
    }
  }
}
</style>
