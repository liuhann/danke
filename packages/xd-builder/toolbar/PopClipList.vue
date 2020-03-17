<template>
<el-popover
  placement="bottom-start"
  popper-class="toolbar-pop"
  title="选择裁切图案"
  width="360"
  trigger="click">
  <a class="action" slot="reference">
    <i  class="icon el-icon-crop" />
  </a>
  <div class="clippath-list">
    <div class="clippath" v-for="clippath in clippaths" :key="clippath" @click="$emit('input',clippath)">
      <div class="container" :style="{
        clipPath: clippath
       }"></div>
    </div>
  </div>
</el-popover>
</template>

<script>
import { Popover } from 'element-ui'
import clippaths from './clippaths'

export default {
  name: 'PopClipList',
  components: {
    [Popover.name]: Popover
  },
  data () {
    return {
      clippaths
    }
  }
}
</script>

<style scoped lang="scss">
.clippath-list {
  display: flex;
  flex-wrap: wrap;
  .clippath {
    width: 75px;
    height: 75px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 7px;
    &:hover {
      background-color: #efefef;
      cursor: pointer;
    }
    .container {
      width: 48px;
      height: 48px;
      background: #00bf72;
    }
  }
}
</style>
