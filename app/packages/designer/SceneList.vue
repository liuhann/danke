<template>
<div class="scene-list-wrapper">
  <van-nav-bar title="场景列表" left-text="新增空白场景" @click-right="close" @click-left="addEmptyScene">
    <van-icon name="cross" slot="right" />
  </van-nav-bar>
  <div class="list">
    <div class="block scene" v-for="(scene, index) in scenes" :key="index" @click="chooseScene(index)" :class="[currentScene === scene?'current': '']">
      <scene-thumbnail :scene="scene" :device="{width: previewWidth, height: previewHeight}"></scene-thumbnail>
      <div class="delete-container">
        <van-icon name="delete" @click.stop="deleteScene(index)"></van-icon>
      </div>
      <div class="order">{{index+1}}</div>
    </div>
  </div>
</div>
</template>

<script>
import SceneThumbnail from './SceneThumbnail'
export default {
  name: 'SceneList',
  components: {
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
    }
  },
  computed: {
    previewWidth () {
      return this.device.width / 4 - 10
    },
    previewHeight () {
      return this.previewWidth * 1.8
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
      this.$emit('chooseScene', index)
    },
    deleteScene (index) {
      this.$emit('deleteScene', index)
    }
  }
}
</script>

<style lang="less">
.scene-list-wrapper {
  width: 100vw;
  height: 100vh;
  background-color: #fff;

  .list {
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
          border: 2px solid #4b0;
          .order {
            background: #4b0;
          }
        }
        .delete-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 21vw;
          text-align: center;
          line-height: 36px;
          .van-icon-delete {
            font-size: 18px;
            color: #f44;
          }
        }
        .order {
          position: absolute;
          right: 5px;
          top: 5px;
          font-size: 18px;
          background: rgba(0,0,0,.6);
          color: #fff;
          width: 18px;
          border-radius: 7px;
          text-align: center;
        }
      }
    }
  }
}
</style>
