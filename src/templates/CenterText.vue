<template>
  <div class="center-text">
    {{data.text}}
  </div>
</template>

<script>
export default {
  name: 'CenterText',
  props: {
    data: {
      type: Object
    }
  }
}
</script>

<style lang="less">
.center-text {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
