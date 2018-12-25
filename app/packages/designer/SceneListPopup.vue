<template>
<van-popup v-model="showPopup" class="pop-page-list" position="center" :overlay="true">
  <div class="pages-wrapper">
    <van-row type="flex" justify="space-around" class="header">
      <van-col span="21">
        <van-button plain type="primary" @click="addEmptyScene" size="small">新增</van-button>
        <van-button plain type="primary" size="small" @click="cloneCurrentScene">复制当前页</van-button>
      </van-col>
      <van-col span="2"><van-icon name="cross" @click="showPopup = false"></van-icon></van-col>
    </van-row>
    <div class="list">
      <div class="block scene" v-for="(scene, index) in scenes" :key="index" @click="chooseScene(index)" :class="[currentScene === scene?'current': '']">
        <scene-thumbnail :scene="scene" :device="{width: 64, height: 120}"></scene-thumbnail>
        <van-icon name="delete" @click.stop="deleteScene(index)"></van-icon>
        <div class="order">{{index+1}}</div>
      </div>
    </div>
  </div>
</van-popup>
</template>

<script>
import SceneThumbnail from './SceneThumbnail'
export default {
  name: 'SceneListPopup',
  components: {
    SceneThumbnail
  },
  props: {
    scenes: {
      type: Array
    },
    currentScene: {
      type: Object
    }
  },
  data () {
    return {
      showPopup: false
    }
  },
  methods: {
    show () {
      this.showPopup = true
    },
    addEmptyScene () {
      this.$emit('addEmptyScene')
    },
    cloneCurrentScene () {
      this.$emit('cloneScene')
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
.pop-page-list {
  .pages-wrapper {
    width: 320px;
    height: 480px;

    .header {
      line-height: 40px;
      height: 40px;
      border-bottom: 1px solid #E4E4E4;
      .van-button {
        margin-left: 10px;
      }
    }
    .list {
      height: 440px;
      overflow-y: auto;
      .block {
        width: 64px;
        height: 120px;
        margin: 5px 6px;
        float: left;
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
          .van-icon-delete {
            position: absolute;
            bottom: 10px;
            font-size: 18px;
            color: #f44;
            left: 21px;
          }
          .order {
            position: absolute;
            right: 5px;
            top: 5px;
            font-size: 12px;
            background: rgba(0,0,0,.6);
            color: #fff;
            width: 14px;
            border-radius: 7px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
