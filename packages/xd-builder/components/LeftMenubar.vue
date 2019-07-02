<template>
<div class="element-bar">
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
    </div>
    <div class="bottom">
      <a class="button is-white icon-clone" @click="$parent.showElementsLayer = !$parent.showElementsLayer"></a>
      <a class="button is-white icon-th-list" @click="$parent.showElementsLayer = !$parent.showElementsLayer"></a>
    </div>
  </div>
</template>
<script>
export default {
  inject: ['fileChoosed', 'insertShape', 'insertText']
}
</script>
<style lang="scss">
.element-bar {
  position: absolute;
  z-index: 101;
  top: 2.5em;
  left: 0;
  bottom: 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content:space-between;
  .top, .bottom {
    display: flex;
    flex-direction: column;
  }
}
</style>

