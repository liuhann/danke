<template>
<nav class="scene-config">
  <div class="form-title">
    <div class="content">场景配置</div>
  </div>
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
  <div class="field has-addons bottom-line">
    <p class="control">
      <a class="button is-static is-small">层次</a>
    </p>
    <p class="control">
      <input class="input is-small" style="width: 220px;" v-model="scene.z">
    </p>
  </div>
  <edit-background v-model="scene.background"></edit-background>
  <edit-animation :animation="scene.animation.in" animation-type="in" :icon="SVG_IN"></edit-animation>
  <edit-animation :animation="scene.animation.dura" animation-type="dura" :icon="SVG_DURA"></edit-animation>
  <edit-animation :animation="scene.animation.out" animation-type="out" :icon="SVG_OUT"></edit-animation>
  <div class="field has-addons">
    <a class="button is-small" @click="previewScene">
      预览
    </a>
    <p class="control">
      <a class="button is-danger is-small" @click="deleteCurrentScene">删除</a>
    </p>
  </div>
</nav>
</template>

<script>
import EditBackground from './props/EditBackground.vue'
import SVG_DURA from '../svg/loading.svg'
import SVG_IN from '../svg/login.svg'
import SVG_OUT from '../svg/logout.svg'
import EditAnimation from './props/EditAnimation.vue'
export default {
  name: 'SceneConfig',
  props: {
    scene: {
      type: Object
    }
  },
  components: {
    EditBackground,
    EditAnimation
  },
  inject: ['zoomIn', 'zoomOut', 'previewScene', 'zoom', 'deleteCurrentScene', 'previousScene', 'nextScene'],
  data () {
    return {
      SVG_DURA,
      SVG_IN,
      SVG_OUT
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
.scene-config {
  padding: 10px;
  .form-title {
    padding-bottom: .3rem;
    margin-bottom: .5rem;
    border-bottom: 1px solid #eee;
  }
}
</style>
