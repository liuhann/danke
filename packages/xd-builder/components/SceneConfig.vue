<template>
<nav class="panelis-small" id="scene-config">
  <p class="panel-heading">
    场景配置
  </p>
  <div class="panel-body">
    <div class="field has-addons">
      <p class="control">
        <a class="button is-static is-small">名称</a>
      </p>
      <p class="control">
        <input class="input is-small" style="width: 220px;" v-model="scene.name">
      </p>
    </div>
    <div class="field has-addons">
      <p class="control">
        <a class="button is-static is-small">切换</a>
      </p>
      <p class="control">
        <input class="input is-small" :disabled="scene.manual" v-model="scene.leave">
      </p>
      <p class="control">
        <a class="button is-small">
          <input type="checkbox" v-model="scene.manual">
          手动
        </a>
      </p>
    </div>
    <edit-background v-model="scene.background"></edit-background>
    <div class="field has-addons">
      <a class="button is-small" @click="previewScene">
        场景预览
      </a>
      <p class="control">
        <a class="button is-danger is-small" @click="deleteCurrentScene">删除</a>
      </p>
    </div>
  </div>
</nav>
</template>

<script>
import EditBackground from './props/EditBackground.vue'
export default {
  name: 'SceneConfig',
  props: {
    scene: {
      type: Object
    }
  },
  components: {
    EditBackground
  },
  inject: ['zoomIn', 'zoomOut', 'previewScene', 'zoom', 'deleteCurrentScene'],
  data () {
    return {
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss">
#scene-config {
  position: absolute;
  z-index: 1002;
  top: 2.5em;
  background-color: #fff;
  width: 320px;
  right: 0;
  .panel-body {
    padding: 10px;
    border: 1px solid #ccc;
    border-top: none;
  }
}
</style>
