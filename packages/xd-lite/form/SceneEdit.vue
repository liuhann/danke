<template>
  <van-form>
    <van-field
      label="自动切换"
    >
      <template #input>
        <van-stepper v-model="scene.duration" /> 秒
      </template>
    </van-field>

    <van-field
      label="背景场景"
    >
      <template #input>
        <van-switch v-model="scene.background" size="20" />
      </template>
    </van-field>

    <van-field
      label="覆盖"
    >
      <template #input>
        <van-switch v-model="scene.cover" size="20" />
      </template>
    </van-field>
  </van-form>
</template>

<script>
export default {
  name: "SceneEdit",
  props: {
    scene: {
      type: Object
    }
  }
}
</script>

<style scoped>

</style>
