<template>
  <div id="scene-list">
    <div class="actions">
      <el-button type="primary" size="mini" @click="addScene">
        新增场景
      </el-button>
      <el-button v-if="checkedScenes.length" type="primary" size="mini">
        复制
      </el-button>
      <el-button v-if="checkedScenes.length" type="danger" size="mini" @click="deleteScene">
        删除
      </el-button>
      <el-button size="mini" @click="close">
        关闭
      </el-button>
    </div>
    <draggable v-model="work.scenes" class="list-wrapper">
      <div v-for="(scene, index) in work.scenes" :key="scene._id" class="scene-wrapper" :class="(scene === current || scene.checked)? 'current': ''" :style="{
        width: viewPort.width + 'px',
        height: (viewPort.height + 40) + 'px'
      }"
      >
        <render-scene :scene="scene" :view-box="work.viewBox" :view-port="viewPort" />
        <div class="config">
          <span class="scene-name">{{ scene.name }}</span>
          <el-popover placement="top" title="场景">
            <el-button slot="reference" icon="el-icon-more" style="margin: 0 10px;" type="text" size="mini" />
            <div class="more-menu">
              <div class="menu-item" style="margin-bottom: 10px;">
                <el-input v-model="scene.name" style="width: 120px;" width="120" size="mini" />
                <el-button size="mini" plain @click="copyScene(index)">
                  复制
                </el-button>
                <el-button type="danger" size="mini" plain icon="el-icon-delete-solid" @click="deleteScene(index)">
                  删除
                </el-button>
              </div>
              <div class="menu-item" style="margin-bottom: 10px;">
                <label style="margin-right: 10px;">持续时间</label>
                <el-input-number v-model="scene.duration" controls-position="right" size="mini" />  秒
              </div>
              <div class="menu-item" style="margin-bottom: 10px;">
                <label style="margin-right: 10px;">离开时间</label>
                <el-input-number v-model="scene.exit" controls-position="right" size="mini" />  秒
              </div>
              <div class="menu-item" style="margin-bottom: 10px;">
                <label style="margin-right: 10px;">离开动画</label>
                <el-checkbox v-model="scene.renderExit" />
              </div>
              <div class="menu-item" style="margin-bottom: 10px;">
                <label style="margin-right: 10px;">视角层次</label>
                <el-input-number v-model="scene.z" controls-position="right" size="mini" />
              </div>
            </div>
          </el-popover>
          <el-button type="text" @click="chooseScene(scene)">
            选择
          </el-button>
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
import toolbarPopMixin from './toolbar/toolbarPopMixin'
import draggable from 'vuedraggable'
import sceneMixins from './mixins/sceneMixins'
import RenderScene from './render/RenderScene'
import { shortid } from '../utils/string'
export default {
  name: 'SceneList',
  components: {
    RenderScene,
    draggable
  },
  mixins: [ sceneMixins, toolbarPopMixin ],
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

    copyScene (index) {
      const cloned = JSON.parse(JSON.stringify(this.work.scenes[index]))
      cloned.id = shortid()
      this.work.scenes.push(cloned)
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
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
  }

  .scene-wrapper {
    margin: 5px;
    input[type="number"] {
      margin: 0 5px;
      border: 1px solid #eee;
      padding: 4px;
      width: 36px;
    }
    .config {
      height: 40px;
      line-height: 40px;
      display: flex;
      padding: 0 5px;
      .scene-name {
        flex: 1;
      }
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
