<template>
<div class="tool-bar is-clearfix">
    <div style="float: left">
      <a class="button is-white icon-menu" @click="showLeftToggleMenu = true"></a>
    </div>
    <div style="float: right;">
      <a class="button is-white" @click="zoomIn">
        <i class="icon-minus-1"></i>
      </a>
      <a class="button is-white">
        {{zoom}}
      </a>
      <a class="button is-white" @click="zoomOut">
        <i class="icon-plus-1"></i>
      </a>
      <a class="button is-white">
        <i class="icon-right-dir" @click="runPreview"></i>
      </a>
      <a class="button is-success is-rounded is-small button-share">发布并分享</a>
    </div>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="scss">
#scene-maker {
  .tool-bar {
    background-color: #fff;
    .button-share {
      margin: .25em 1em;
    }
  }
}
</style>


