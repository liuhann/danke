<template>
<nav id="scene-list">
  <div class="heading">
    场景列表
  </div>
  <div class="item-list">
  </div>
</nav>  
</template>

<script>
export default {
  name: 'SceneList'
}
</script>

<style lang="scss">
#scene-list {
  display: flex;
  flex-direction: column;
  .heading {
    color: #999;
    font-weight: bold;
    margin: 0 .5em;
    padding: .75em 0;
    border-bottom: 1px solid #eee;
  }
  .item-list {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
