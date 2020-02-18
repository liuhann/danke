<template>
<div id="left-scene-template">
  <div class="scene-list">
    <div class="scene-item" @click="insertNewScene">
      <div class="scene-preview">空白场景</div>
    </div>
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
