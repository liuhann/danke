<template>
  <div id="scene-list">
    <div class="pop-title">
      <span v-if="!currentEditScene" class="text">
        <el-button size="mini" type="success" @click="addScene">新增场景</el-button>
      </span>
      <div v-if="currentEditScene" class="text">
        <el-button size="mini" type="success" @click="currentEditScene = null">关闭</el-button>
      </div>
      <a class="btn-close" @click="$emit('close')"><i class="el-icon-circle-close" /></a>
    </div>
    <el-form v-if="currentEditScene" size="mini" label-width="80px">
      <el-form-item label="层次">
        <el-input-number v-model="currentEditScene.z" controls-position="right" size="mini" />
      </el-form-item>
      <el-form-item label="开始">
        <el-input-number v-model="currentEditScene.enter" controls-position="right" size="mini" /> 毫秒
      </el-form-item>
      <el-form-item label="结束">
        <el-input-number v-model="currentEditScene.exit" controls-position="right" size="mini" />  毫秒
      </el-form-item>
      <el-form-item label="完成">
        <el-input-number v-model="currentEditScene.fin" controls-position="right" size="mini" /> 毫秒
      </el-form-item>
    </el-form>
    <draggable v-show="!currentEditScene" v-model="work.scenes" class="list-wrapper">
      <div v-for="(scene, index) in work.scenes" :key="scene._id" class="list-item" :style="sceneItemStyle">
        <div class="scene-wrapper">
          <render-scene :scene="scene" :view-box="work.viewBox" :view-port="viewPort" @click="chooseScene(scene)" />
          <div class="hovers">
            <el-button size="mini" circle type="info" icon="el-icon-edit" @click="editScene(scene)" />
            <el-button size="mini" circle type="info" icon="el-icon-document-copy" @click="copyScene(index)" />
            <el-button size="mini" circle type="danger" icon="el-icon-delete" @click="deleteScene(index)" />
          </div>
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import sceneMixins from '../mixins/sceneMixins'
import workMixin from '../mixins/workMixin'
import RenderScene from '../render/RenderScene.vue'
import { shortid } from '../../utils/string'
export default {
  name: 'SceneList',
  components: {
    RenderScene,
    draggable
  },
  mixins: [ sceneMixins, workMixin ],
  props: {
    work: {
      type: Object
    }
  },
  data () {
    return {
      currentEditScene: null,
      showSetting: false
    }
  },
  computed :{
    viewPort () {
      // 分为横屏、纵屏2种情况，具体可以指定一个特定比例。 横屏为一行2个，纵屏为一行3个，高度按比例确认
      let width = 122
      if (this.work.viewBox.width > this.work.viewBox.height) {
        // 横屏 一行2个
        width = 194
      } 
      return {
        width: width,
        height: (width / this.work.viewBox.width * this.work.viewBox.height)
      }
    },
    
    sceneItemStyle () {
      return {
        background: this.work.color,
        width: this.viewPort.width + 'px',
        height: this.viewPort.height + 'px'
      }
    },
    checkedScenes () {
      return this.work.scenes.filter(scene => scene.checked)
    }
  },
  created () {},
  mounted () {},
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
      this.work.scenes.splice(index, 0, cloned)
    },

    editScene (scene) {
      this.currentEditScene = scene
      console.log('edit scene', this.currentEditScene)
    },

    chooseScene (scene) {
      this.$emit('choose-scene', scene)
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
  background-color: rgba(255, 255, 255, 1);
  height: 100vh;
  width: 100%;
  .list-wrapper {
    padding: 10px;
    max-height: calc(100% - 40px);
    box-sizing: border-box;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
  }

  .list-item {
    margin: 5px;
    // border: 1px solid #eee;
    background: rgba(0,0,0, .05);
    display: inline-block;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    &:hover, &.current {
      cursor: pointer;
      box-shadow: 0 0 0 2px #67C23A;
    }
    .scene-wrapper {
      overflow: hidden;
      border: 1px solid #efefef;
      .hovers {
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 101;
        display: none;
      }
      &:hover {
        .hovers {
          display: initial;
        }
      }
     
      .element {
        position: absolute;
      }
    }
  }
}
</style>
