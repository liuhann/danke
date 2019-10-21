<template>
<div class="tool-bar" :class="[vertical? 'flex-column': '']">
  <div class="top" :class="[vertical? 'flex-column': '']">
    <a class="file">
      <label class="file-label">
        <input class="file-input" type="file" name="resume" @input="svgFileChoosed">
        <span class="button is-white icon-picture-1">
        </span>
      </label>
    </a>
    <a class="button is-white icon-doc-landscape" @click="insertShape('rect')"></a>
    <a class="button is-white icon-circle-thin" @click="insertShape('circle')"></a>
    <a class="button is-white icon-sort-alphabet" @click="insertText"></a>
    <a class="file">
      <label class="file-label">
        <input class="file-input" type="file" name="crop" @input="fileChoosed">
        <span class="button icon-crop is-white"></span>
      </label>
    </a>
  </div>
</div>
</template>
<script>
// import { Popover } from 'element-ui'
import { templates } from '../../danke-core/elements/layout'
export default {
  name: 'ToolBar',
  components: {
  },
  props: {
    vertical: {
      type: Boolean,
      default: true
    }
  },
  inject: ['fileChoosed', 'insertShape', 'insertText', 'svgFileChoosed', 'insertLayout'],
  data () {
    return {
      layoutTemplates: templates
    }
  }
}
</script>
<style lang="scss">
.tool-bar {
  background-color: #fff;
  display: flex;
  justify-content:space-between;
  .top, .bottom {
    display: flex;
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
