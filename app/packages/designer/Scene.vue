<template>
<div class="scene">
  <div class="element-wrapper" v-for="(element, index) in scene.elements" :key="index">

  </div>
</div>
</template>

<script>
export default {
  name: 'Scene',
  props: {
    scene: {
      type: Object
    }
  }
}
</script>

<style scoped>

</style>
