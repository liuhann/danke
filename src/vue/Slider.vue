<template>
<div class="slider">
  <div v-for="(scene, index) in scenes" class="scene-wrapper animated" :key="index" :z-index="index*1000"
       :class="[scene.state, scene.active.animation]"
       :style="{animationDuration: scene.active.duration + 'ms'}">
    <scene
      v-if="scene.mount"
      :template="scene.template"
      :state="scene.state"
      :index="index"
      :data="scene.data">
    </scene>
  </div>
  <img v-for="(resource, index) in resources" :src="resource.url" :key="index" :style="{display: 'none'}">
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
      scenes: [],
      grounds: [],
      resources: []
    }
  },
  created () {
  },

  methods: {
    setScenes (scenes) {
      this.scenes = scenes
    },
    setGrounds (grounds) {
      this.grounds = grounds
    },
    setResources (resources) {
      this.resources = resources
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
