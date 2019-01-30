<template>
<div class="scene-list-wrapper">
  <van-nav-bar title="场景管理" @click-left="close">
    <van-icon name="cross" slot="left" />
  </van-nav-bar>

  <div class="pop-content">
    <van-row type="flex" class="btns">
      <van-col span="8"><van-button plain type="primary" size="small" @click="addEmptyScene">新增空白场景</van-button></van-col>
      <van-col span="16" class="ar">
        <van-button type="primary" size="small" @click="play">播放</van-button>
        <van-button plain size="small" @click="addEmptyScene">保存</van-button>
      </van-col>
    </van-row>
    <div class="scene-list">
      <div class="block scene" v-for="(scene, index) in slideScenes" :key="scene.id" @click="chooseScene(scene)" :class="[currentScene === scene?'current': '']">
        <scene-thumbnail :scene="scene" :device="{width: previewWidth, height: previewHeight}"></scene-thumbnail>
        <div class="setting-container">
          <van-icon name="setting-o" @click.stop="editScene(scene)"></van-icon>
        </div>
        <div v-if="scene.type === 'background'" class="background">背景</div>
      </div>
    </div>
  </div>

  <van-popup v-model="showConfigScene" class="pop-scene-config" :overlay="true" get-container="body">
    <config-scene v-model="currentEditScene" v-if="currentEditScene" @close="showConfigScene = false"></config-scene>
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
      return this.scenes.filter((scene) => {
        return scene.type === 'background'
      })
    },

    slideScenes () {
      return this.scenes
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    addEmptyScene () {
      this.$emit('add')
    },
    chooseScene (scene) {
      this.$emit('choose-scene', scene)
    },
    deleteScene (index) {
      this.$emit('deleteScene', index)
    },
    play () {
      this.$emit('preview')
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
    .btns {
      margin: 10px;
      .van-button {
        margin-right: 10px;
      }
    }
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
              color: #666;
            }
          }
          .background {
            position: absolute;
            right: 0;
            top: 0;
            font-size: 12px;
            background: rgba(60,187,0,.6);
            color: #fff;
            padding: 5px 10px;
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
