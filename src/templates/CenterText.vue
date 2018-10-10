<template>
  <div class="center-text" @click="screenClick">
    {{data.text}}
  </div>
</template>

<script>
export default {
  name: 'CenterText',
  props: {
    data: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  methods: {
    screenClick () {
      this.engine.emit({
        index: this.index,
        name: 'click'
      })
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
