<template>
  <div id="app">
    <slider></slider>
    <div
      v-for="(scene, index) in scenes"
      class="scene-wrapper"
      :z-index="index"
      v-show="scene.show"
      :key="index">
      <scene
        :name="scene.type"
        :ref="'scene-' + scene.id"
        :data="scene"
        @out-complete="sceneComplete(scene, $event)"
        @begin-out="sceneOut(scene, $event)"/>
    </div>
  </div>
</template>

<script>
import './style/base.less'
import merge from 'merge'
import Slider from './Slider'
import Scene from './scene'

export default {
  name: 'App',
  components: {
    Slider
  },
  props: {
    config: {
      type: Object
    }
  },

  data () {
    return {
      currentScene: 'start',
      scenes: []
    }
  },

  created () {
    if (this.config) {
      for (let scene of this.config.scenes) {
        if (scene.id === 'start') {
          scene.show = true
        } else {
          scene.show = false
        }
        this.scenes.push(merge.recursive(true, {
          complete: {
            hide: true
          }
        }, scene))
      }
    }
  },

  mounted () {
    this.$refs['scene-start'][0].in()
  },

  methods: {
    async load () {

    },

    sceneOut (currentScene, next) {
      const nextId = next
      for (let i = 0; i < this.scenes.length; i++) {
        const scene = this.scenes[i]
        if (scene.id === nextId) {
          scene.show = true
          this.$set(this.scenes, i, scene)
          this.$refs['scene-' + nextId][0].in()
          break
        }
      }
    },

    sceneComplete (currentScene, next) {
      if (currentScene.complete.hide) {
        for (let i = 0; i < this.scenes.length; i++) {
          const scene = this.scenes[i]
          if (scene.id === currentScene.id) {
            currentScene.show = false
            this.$set(this.scenes, i, scene)
            break
          }
        }
      }
    }
  }
}
</script>
