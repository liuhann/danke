<template>
  <van-popup v-model="popshow" position="bottom" :style="{ height: '140px'}">
    <van-swipe class="my-swipe" indicator-color="white" :width="viewPort.width" :height="viewPort.height" :loop="false" @change="onChange">
      <van-swipe-item v-for="(scene, index) in work.scenes" :key="index">
        <render-scene :scene="scene" :view-box="work.viewBox" :view-port="viewPort" />
      </van-swipe-item>
      <van-swipe-item>增加</van-swipe-item>
      <template #indicator>
        <div class="custom-indicator">
          {{ current + 1 }}/ {{ work.scenes.length }}
        </div>
      </template>
    </van-swipe>
  </van-popup>
</template>

<script>
import RenderScene from '../../xd-builder/render/RenderScene'
export default {
  name: "SceneList",
  components: {
    RenderScene
  },
  props: {
    value: {
      type: Boolean
    },
    work: {
      type: Object
    }
  },
  data () {
    return {
      current: 0,
      popshow: false
    }
  },
  computed: {
    viewPort () {
      return {
        height: 140,
        width: this.work.viewBox.width * 140 / this.work.viewBox.height
      }
    }

  },
  watch: {
    value () {
      this.popshow = this.value
    }
  },

  methods: {
    onChange(index) {
      this.current = index;
    },
    chooseScene (scene) {
      this.$emit('choose-scene', scene)
    }
  }
}
</script>

<style scoped>
.custom-indicator {
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding: 2px 5px;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.1);
}
.van-swipe-item {
  overflow: hidden;
}
</style>
