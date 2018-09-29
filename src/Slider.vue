<template>
<div class="slider">
  <div v-for="(scene, index) in scenes" class="scene-wrapper animated" :key="index" :class="[scene.state, scene.transition]">
    <scene
      :template="scene.template"
      :data="scene.data"
      @leave-begin="onSceneBeginLeave(scene, $event)"
      @leave-end="onSceneEndLeave(scene, $event)"
     />
  </div>
</div>
</template>

<script>
import Scene from './scene'
import STATES from './states'
import './style/base.less'
import './style/scene.less'

export default {
  name: 'Slider',
  components: {
    Scene
  },
  props: {
    scenes: {
      type: Array
    }
  },
  data () {
    return {
      stages: []
    }
  },
  methods: {
    enterScene (scene) {

    },

    outScene (scene) {

    },

    onSceneBeginLeave (scene, data) {
      scene.state = STATES.LEAVING
    },

    onSceneEndLeave (scene, data) {
      scene.state = STATES.LEAVE_TO
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
}
</style>
