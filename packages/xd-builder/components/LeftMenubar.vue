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
      <a class="button is-white icon-check-empty-1" @click="insertShape('rect')"></a>
      <a class="button is-white icon-circle-thin" @click="insertShape('circle')"></a>
      <a class="button is-white icon-sort-alphabet" @click="insertText"></a>
    </div>
    <div class="bottom">
      <a class="button is-white icon-check-empty-1" @click="$parent.showElementsLayer = !$parent.showElementsLayer"></a>
    </div>
  </div>
</template>
<script>
export default {
  inject: ['fileChoosed', 'insertShape', 'insertText']
}
</script>
