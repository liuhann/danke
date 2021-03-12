<template>
  <van-grid>
    <van-grid-item v-for="color in antColors" :key="color">
      <div class="" :style="{
        backgroundColor: color
      }"
      ></div>
    </van-grid-item>
  </van-grid>
</template>

<script>

export default {
  name: "InsertColor",
  data () {
    return {
      antColors
    }
  }
}
</script>

<style scoped>

</style>