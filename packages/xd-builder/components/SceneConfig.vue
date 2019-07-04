<template>
<nav class="panelis-small" id="scene-config">
  <p class="panel-heading">
    画面配置
  </p>
  <div class="panel-body">
    <edit-background v-model="scene.background"></edit-background>
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
