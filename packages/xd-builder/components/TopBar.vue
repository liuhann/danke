<template>
<div class="top-bar is-clearfix">
  <div class="flex-1">
    <a class="button is-white icon-menu" @click="$parent.showLeftToggleMenu = true"></a>
  </div>
  <div>
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
      <i class="icon-right-dir" @click="runWork"></i>
    </a>
    <a class="button is-success is-rounded is-small button-share">发布并分享</a>
  </div>
</div>
</template>
<script>
import { Dialog } from 'element-ui'
export default {
  name: 'TopBar',
  components: {
    Dialog
  },
  data () {
    return {
      isEditName: false
    }
  },
  inject: ['zoomIn', 'zoomOut', 'runWork', 'zoom'],
  methods: {
  }
}
</script>
<style lang="scss">
#xd {
  .top-bar {
    display: flex;
    background-color: #fff;
    .align-right {
      text-align: right;
    }
    .tags {
      .tag {
        margin-top: .3em;
      }
    }
    .flex-1 {
      flex: 1;
    }
    .button-share {
      margin: .25em 1em;
    }
  }
}
</style>
