<template>
<nav class="scene-config">
  <div class="form-title">
    <div class="text">场景配置</div>
  </div>
  <div class="field has-addons">
    <p class="control field-lb">
      名称
    </p>
    <p class="control">
      <input class="input is-small" style="width: 220px;" v-model="scene.name">
    </p>
  </div>
  <div class="field has-addons">
    <p class="control field-lb">
      切换
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
  <div class="field has-addons">
    <p class="control field-lb">
      层次
    </p>
    <p class="control">
      <input class="input is-small" style="width: 220px;" v-model="scene.z">
    </p>
  </div>
  <edit-background v-model="scene.background"></edit-background>
  <divider content-position="right">动画效果</divider>
  <tabs size="is-small" v-model="animationType" :tabs="animationTabs"></tabs>
  <edit-animation :animation="scene.animation[animationType]" :animation-type="animationType"></edit-animation>
  <divider></divider>
  <div class="">
    <a class="button is-primary">Primary</a>
    <a class="button is-link">Link</a>
    <a class="button is-info">Info</a>
    <a class="button is-small" @click="previewScene">预览</a>
    <a class="button is-danger is-small" @click="deleteCurrentScene">删除</a>
    <div class="opers">
      <span class="icon-clone" @click="copyScene"></span>
      <span class="icon-paste" :class="[clipboard.elements.length > 0? 'has-clipboard': '']" @click="pasteElement"></span>
    </div>

  </div>
</nav>
</template>

<script>
import EditBackground from './props/EditBackground.vue'
import EditAnimation from './props/EditAnimation.vue'
import Tabs from '../../common/components/Tabs.vue'
import { Divider } from 'element-ui'
export default {
  name: 'SceneConfig',
  props: {
    scene: {
      type: Object
    }
  },
  components: {
    EditBackground,
    EditAnimation,
    Tabs,
    Divider
  },
  inject: ['zoomIn', 'zoomOut', 'previewScene', 'zoom', 'deleteCurrentScene', 'previousScene', 'nextScene', 'clipboard', 'pasteElement', 'copyScene'],
  data () {
    return {
      animationType: 'in',
      animationTabs: [{
        title: '进入',
        key: 'in'
      }, {
        title: '持续',
        key: 'dura'
      }, {
        title: '离开',
        key: 'out'
      }]
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
    display: flex;
    .text {
      flex: 1;
    }
    .opers {
      font-size: 12px;
      color: #333;
      .icon-paste {
        color: #ccc;
        &.has-clipboard {
          color: #333;
        }
      }
    }
  }
}
</style>
