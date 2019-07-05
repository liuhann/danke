<template>
<nav class="panelis-small" id="scene-config">
  <p class="panel-heading">
    画面配置
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
    <edit-background v-model="scene.background"></edit-background>
    <div class="field has-addons">
      <p class="control">
        <a class="button is-static is-small">切换到下一个</a>
      </p>
      <p class="control">
        <input class="input is-small" v-model="scene.leave">
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
  z-index: 11;
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
