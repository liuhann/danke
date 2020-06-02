<template>
<div id="scene-list">
  <div class="actions">
    <el-button type="primary" size="mini" @click="addScene">新增场景</el-button>
    <el-button type="primary" size="mini" v-if="checkedScenes.length">复制</el-button>
    <el-button type="danger" size="mini" @click="deleteScene" v-if="checkedScenes.length">删除</el-button>
    <el-button size="mini" @click="close">关闭</el-button>
  </div>
  <div class="list-wrapper">
    <div v-for="(scene, index) in work.scenes" :key="scene._id" class="scene-wrapper" :class="(scene === current || scene.checked)? 'current': ''" :style="{
      width: viewPort.width + 'px',
      height: (viewPort.height + 40) + 'px'
    }" >
      <render-scene :scene="scene" :view-box="work.viewBox" :view-port="viewPort"/>
      <div class="config">
        <div class="more" style="padding: 0 5px">
          <el-button type="text" @click="moveScenePrev(index)" icon="el-icon-back" v-if="index > 0"></el-button>
          <el-button type="text" @click="moveSceneNext(index)" icon="el-icon-right" v-if="index < work.scenes.length - 1"></el-button>
          <el-popover placement="bottom">
            <el-button icon="el-icon-more" style="margin: 0 10px;" slot="reference" type="text" size="mini"/>
            <div class="more-menu">
              <div class="menu-item" style="margin-bottom: 20px;">
                <label style="margin-right: 20px;">持续时间</label>
                <el-input-number v-model="scene.duration" controls-position="right" size="mini"/>  秒
              </div>
              <div class="menu-item">
                <el-checkbox v-model="scene.forward">层次靠前</el-checkbox>
                <el-button style="margin-left: 60px;" type="text" icon="el-icon-delete-solid" @click="deleteScene(index)">删除场景</el-button>
              </div>
            </div>
          </el-popover>
          <el-button type="text" style="float: right" @click="chooseScene(scene)">选择</el-button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { Button, Checkbox, MessageBox, InputNumber, Popover } from 'element-ui'
import sceneMixins from './mixins/sceneMixins'
import RenderScene from './render/RenderScene'
export default {
  name: 'SceneList',
  mixins: [ sceneMixins ],
  components: {
    RenderScene,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [Popover.name]: Popover,
    [InputNumber.name]: InputNumber
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
        height: 160,
        width: 160 * this.work.viewBox.width / this.work.viewBox.height
      }
    },
    checkedScenes () {
      return this.work.scenes.filter(scene => scene.checked)
    }
  },
  methods: {
    deleteScene (index) {
      if (this.work.scenes.length === this.checkedScenes.length) {
        MessageBox.prompt('不能将所有场景删除，请至少保留一个场景')
        return
      }
      this.work.scenes.splice(index, 1)
    },
    moveSceneNext (index) {
      const current = this.work.scenes[index]

      this.$set(this.work.scenes, index, this.work.scenes[index + 1])
      this.$set(this.work.scenes, index + 1, current)
    },
    moveScenePrev (index) {
      const current = this.work.scenes[index]
      this.$set(this.work.scenes, index, this.work.scenes[index - 1])
      this.$set(this.work.scenes, index - 1 , current)
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
    line-height: 40px;
    padding: 0 20px;
    background: #fff;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0 2px;
  }

  .list-wrapper {
    padding: 10px;
    height: calc(100% - 40px);
    box-sizing: border-box;
    overflow: auto;
  }



  .scene-wrapper {
    display: inline-block;
    margin: 5px;
    position: relative;
    input[type="number"] {
      margin: 0 5px;
      border: 1px solid #eee;
      padding: 4px;
      width: 36px;
    }
    .scene {
      position: relative;
      overflow: hidden;
      border: 1px solid #CCC;
      border-radius: 5px;
      &:hover, &.current {
        cursor: pointer;
        border: 1px solid #00bf72;
      }
      .element {
        position: absolute;
      }
    }
  }
}
</style>
