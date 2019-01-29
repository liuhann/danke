<template>
<div class="scene-list-wrapper">
  <van-nav-bar title="场景管理" right-text="新增空白场景" @click-left="close" @click-right="addEmptyScene">
    <van-icon name="cross" slot="left" />
  </van-nav-bar>
  <div class="pop-content">
    <van-panel title="场景列表">
      <div class="scene-list">
        <div class="block scene" v-for="(scene, index) in scenes" :key="index" @click="chooseScene(index)" :class="[currentScene === scene?'current': '']">
          <scene-thumbnail :scene="scene" :device="{width: previewWidth, height: previewHeight}"></scene-thumbnail>
          <div class="setting-container">
            <van-icon name="setting-o" @click.stop="editScene(scene)"></van-icon>
          </div>
          <div class="order">{{index+1}}</div>
        </div>
      </div>
      <div slot="footer">
        <van-button plain type="primary" size="small" @click="addEmptyScene">新增空白场景</van-button>
      </div>
    </van-panel>
  </div>

  <van-popup v-model="showConfigScene" class="pop-scene-config" :overlay="true" get-container="body">
    <config-scene v-model="currentEditScene" v-if="currentEditScene"></config-scene>
  </van-popup>
</div>
</template>

<script>
import SceneThumbnail from '../SceneThumbnail'
import ConfigScene from './ConfigScene'
export default {
  name: 'SceneList',
  components: {
    ConfigScene,
    SceneThumbnail
  },
  props: {
    device: {
      type: Object
    },
    scenes: {
      type: Array
    },
    currentScene: {
      type: Object
    }
  },
  data () {
    return {
      showConfigScene: false,
      currentEditScene: null
    }
  },
  computed: {
    previewWidth () {
      return this.device.width * 0.21
    },
    previewHeight () {
      return this.previewWidth * 1.8
    },
    backgroundScenes () {
      return this.scenes.filter(scene => scene.type === 'background')
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    addEmptyScene () {
      this.$emit('add')
    },
    chooseScene (index) {
      this.$emit('choose-scene', index)
    },
    deleteScene (index) {
      this.$emit('deleteScene', index)
    },

    editScene (scene) {
      this.showConfigScene = true
      this.currentEditScene = scene
    }
  }
}
</script>

<style lang="less">
.scene-list-wrapper {
  width: 100vw;
  height: 100vh;
  background-color: #fff;

  .pop-content {
    overflow-y: auto;
    .scene-list {
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      .block {
        width: 21vw;
        margin: 2vw;
        box-sizing: border-box;
        overflow: hidden;
        &.scene {
          border: 1px solid #eee;
          border-radius: 5px;
          position: relative;
          &.current {
            border: 1px solid #4b0;
            .order {
              background: #4b0;
            }
          }
          .setting-container {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 20vw;
            text-align: center;
            line-height: 28px;
            .van-icon {
              font-size: 20px;
              color: #f44;
            }
          }
          .order {
            position: absolute;
            right: 5px;
            top: 5px;
            font-size: 14px;
            background: rgba(0,0,0,.6);
            color: #fff;
            line-height: 18px;
            height: 18px;
            width: 18px;
            border-radius: 14px;
            text-align: center;
          }
        }
      }
    }
  }

  .add-scene-container {
    padding: 10px 15px;
    text-align: center;
    width: 30%;
    margin: 0 auto;
    /* border: 1px solid green; */
    border-radius: 20px;
  }
}
</style>
