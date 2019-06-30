<template>
<div class="tool-bar is-clearfix">
  <div class="flex-1">
    <a class="button is-white icon-menu" @click="$parent.showLeftToggleMenu = true"></a>
  </div>
  <div>
    <div class="tags has-addons is-centered">
      <span class="tag is-light">
        {{isEditName? '' : $parent.sceneName}}
        <input v-if="isEditName" v-model="$parent.sceneName"/>
      </span>
      <span v-if="!isEditName" class="tag is-info icon-edit is-link" @click="editSceneName"></span>
      <span v-if="isEditName" class="tag is-info icon-check-1 is-link" @click="isEditName = false"></span>
    </div>
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
      <i class="icon-right-dir" @click="runPreview"></i>
    </a>
    <a class="button is-success is-rounded is-small button-share">发布并分享</a>
  </div>
</div>
</template>
<script>
import { Dialog } from 'element-ui'
export default {
  components: {
    Dialog
  },
  data () {
    return {
      isEditName: false
    }
  },
  inject: ['zoomIn', 'zoomOut', 'runPreview', 'zoom', 'sceneName'],
  methods: {
    editSceneName () {
      this.isEditName = true
    }
  }
}
</script>
<style lang="scss">
#xd {
  .tool-bar {
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
