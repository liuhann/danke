<template>
<div class="designer">
  <div class="scene">
    <scene :scene="currentScene" mode="preview"></scene>
  </div>

  <div class="menu">

  </div>

  <div class="prop-panel">

  </div>
</div>
</template>

<script>
import Scene from './Scene'
export default {
  name: 'Designer',
  components: {
    Scene
  },
  data () {
    return {
      currentScene: null,
      scenes: [],
      pageConfig: {

      }
    }
  }
}
</script>

<style scoped>

</style>
