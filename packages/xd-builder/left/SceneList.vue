<template>
  <div id="scene-list">
    <div class="pop-title">
      <span class="text">场景列表</span>
      <a class="btn-close"><i class="el-icon-close" /></a>
    </div>
    <div v-show="!showSetting" class="actions">
      <el-button size="mini" type="success" @click="addScene">新增场景</el-button>
    </div>
    <div v-show="showSetting" class="actions">
      <el-button size="mini" type="success" @click="showSetting=false">关闭</el-button>
    </div>
    <el-form v-show="showSetting" size="mini" label-width="80px">
      <el-form-item label="持续时间">
        <el-input-number v-model="current.duration" controls-position="right" size="mini" />  秒
      </el-form-item>
      <el-form-item label="离开时间">
        <el-input-number v-model="current.exit" controls-position="right" size="mini" />  秒
      </el-form-item>
      <el-form-item label="离开动画">
        <el-checkbox v-model="current.renderExit">
          渲染
        </el-checkbox>
      </el-form-item>
      <el-form-item label="堆叠视角">
        <el-input-number v-model="current.z" controls-position="right" size="mini" />
      </el-form-item>
    </el-form>
    <draggable v-show="!showSetting" v-model="work.scenes" class="list-wrapper">
      <div v-for="(scene, index) in work.scenes" :key="scene._id" class="list-item" :class="(scene === current || scene.checked)? 'current': ''">
        <div :style="{
               background: work.color
             }"
             class="scene-wrapper"
        >
          <render-scene :scene="scene" :view-box="work.viewBox" :view-port="viewPort" @click="chooseScene(scene)" />
          <div class="hovers">
            <el-button size="mini" circle type="info" icon="el-icon-edit" @click="editScene(index)" />
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
import workMixin from '../work/workMixin'
import RenderScene from '../render/RenderScene.vue'
import { shortid } from '../../utils/string'
import { fitRectIntoBounds } from '../mixins/rectUtils'
import ImageDAO from '../../utils/imagedao'
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
    },
    current: {
      type: Object
    }
  },
  data () {
    return {
      showSetting: false
    }
  },
  computed :{
    viewPort () {
      return fitRectIntoBounds(this.work.viewBox, {
        width: 186,
        height: 186
      })
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

    editScene () {
      this.showSetting = true
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
  .actions {
    padding: 10px 20px;
    background: #fff;
    display: flex;
    border-bottom: 1px solid #dadce0;
    .music-control {
      flex: 1;
      display: flex;
      margin-right: 20px;
      .el-button--text {
        font-size: 18px;
        padding: 10px 0;
        &:hover {
          color: #00c7ae;
        }
      }
      .slider {
        flex: 1;
      }
      .seconds {
        padding-left: 10px;
        line-height: 40px;
        width: 130px;
      }
    }
  }
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
    width: 186px;
    height: 186px;
    // border: 1px solid #eee;
    background: rgba(0,0,0, .05);
    display: inline-block;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
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
      &:hover, &.current {
        cursor: pointer;
      }
      .element {
        position: absolute;
      }
    }
  }
}
</style>
