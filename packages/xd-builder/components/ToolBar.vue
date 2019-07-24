<template>
<div class="tool-bar">
    <div class="top">
      <a class="file">
        <label class="file-label">
          <input class="file-input" type="file" name="resume" @input="fileChoosed">
          <span class="button is-white icon-picture-1">
          </span>
        </label>
      </a>
      <a class="button is-white icon-doc-landscape" @click="insertShape('rect')"></a>
      <a class="button is-white icon-circle-thin" @click="insertShape('circle')"></a>
      <a class="button is-white icon-sort-alphabet" @click="insertText"></a>
      <a class="file">
        <label class="file-label">
          <input class="file-input" type="file" name="resume" @input="svgFileChoosed">
          <span class="button icon-svg is-white">
            svg
          </span>
        </label>
      </a>
    </div>
    <div class="bottom">
      <a class="button is-white icon-th-list" :class="$parent.showElementsLayer? 'on': ''" @click="$parent.showElementsLayer = !$parent.showElementsLayer"></a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ToolBar',
  inject: ['fileChoosed', 'insertShape', 'insertText', 'svgFileChoosed']
}
</script>
<style lang="scss">
.tool-bar {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content:space-between;
  .top, .bottom {
    display: flex;
    flex-direction: column;
  }
  .button.on {
    color: #3273dc;
    font-weight: bold;
  }
  .icon-svg {
    font-weight: bold;
    font-size: 12px;
  }
}
</style>
