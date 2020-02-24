<template>
<div id="left-text-template">
  <div class="basic">
    <div class="">添加标题</div>
    <div class="">添加标题</div>
    <div class="">添加标题</div>
  </div>
</div>
</template>

<script>
export default {
  name: 'LeftSceneTemplate',
  methods: {
    insertNewScene () {
      this.$emit('insert')
    }
  }
}
</script>

<style lang="scss">
#left-scene-template {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  bottom: 0;
  .scene-list {
    display: flex;
    flex-wrap: wrap;
    .scene-item {
      width: 50%;
      cursor: pointer;
      .scene-preview {
        margin: 10px;
        height: 120px;
        background: rgba(0,0,0, .2);
        text-align: center;
        line-height: 120px;
        color: #fff;
        &:hover {
          background: rgba(0,0,0, .5);
        }
      }
    }
  }
}
</style>
