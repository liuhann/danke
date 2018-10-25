<template>
<div class="slider">
  <div v-for="(scene, index) in scenes" class="scene-wrapper animated" :key="index" :z-index="index*1000"
       :class="[scene.state, scene.active.animation]"
       :style="{animationDuration: scene.active.duration + 'ms'}">
    <scene
      :template="scene.template"
      :state="scene.state"
      :index="index"
      :data="scene.data">
    </scene>
  </div>
</div>
</template>

<script>
import Scene from './scene'
import '../style/base.less'
import '../style/scene.less'

export default {
  name: 'Slider',
  components: {
    Scene
  },
  props: {

  },
  data () {
    return {
      scenes: []
    }
  },
  created () {
  },

  methods: {
    setScenes (scenes) {
      this.scenes = scenes
    },

    outScene (scene) {

    },

    onSceneBeginLeave (scene, data) {

    },

    onSceneEndLeave (scene, data) {

    }
  }
}
</script>

<style lang="less">
.scene-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: none;
  &.on, &.enter, &.leave {
    display: block;
  }
}
</style>
