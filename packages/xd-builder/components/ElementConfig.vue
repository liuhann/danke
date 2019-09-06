<template>
<nav class="element-prop-config">
  <div class="form-title">
    <div class="text">元素配置</div>
    <div class="opers">
      <span class="icon-clone" @click="copyElement"></span>
      <span class="icon-scissors" @click="cutElement"></span>
      <span class="icon-paste" :class="[clipboard.elements.length > 0? 'has-clipboard': '']" @click="pasteElement"></span>
    </div>
  </div>
  <edit-font v-if="element.font" v-model="element.font"></edit-font>
  <edit-background v-model="element.background" v-if="element.background"></edit-background>
  <edit-position v-model="element.position"></edit-position>
  <edit-size v-model="element.size"></edit-size>
  <edit-mask v-model="element.mask" v-if="element.mask"></edit-mask>
  <div class="tabs is-small">
    <ul>
      <li style="width: 50px;">动画</li>
      <li :class="animationType==='in'? 'is-active': ''"><a @click="animationType = 'in'">进入</a></li>
      <li :class="animationType==='dura'? 'is-active': ''"><a @click="animationType = 'dura'">持续</a></li>
      <li :class="animationType==='out'? 'is-active': ''"><a @click="animationType = 'out'">离开</a></li>
    </ul>
  </div>
  <edit-animation v-if="animationType==='in'" :animation="element.animation.in" animation-type="in"></edit-animation>
  <edit-animation v-if="animationType==='dura'" :animation="element.animation.dura" animation-type="dura"></edit-animation>
  <edit-animation v-if="animationType==='out'" :animation="element.animation.out" animation-type="out"class="bottom-line"></edit-animation>

  <edit-border v-model="element.border" v-if="element.border"></edit-border>
  <edit-shadow v-model="element.shadow" v-if="element.shadow"></edit-shadow>
  <edit-clip-path v-model="element.clip" v-if="element.clip"></edit-clip-path>

  <div class="buttons has-addons">
    <span class="button is-small" @click="moveDown(element)">
      <span class="icon is-small" >
        <i class="icon-angle-up"></i>
      </span>
    </span>
    <span class="button is-small" @click="moveUp(element)">
      <span class="icon is-small" >
        <i class="icon-angle-down"></i>
      </span>
    </span>
    <span class="button is-small" @click="moveBottom(element)">
      <span class="icon is-small" >
        <i class="icon-angle-double-up"></i>
      </span>
    </span>
    <span class="button is-small" @click="moveTop(element)">
      <span class="icon is-small" >
        <i class="icon-angle-double-down"></i>
      </span>
    </span>
  </div>

</nav>
</template>
<script>
import EditFont from './props/EditFont.vue'
import EditPosition from './props/EditPosition.vue'
import EditBackground from './props/EditBackground.vue'
import EditBorder from './props/EditBorder.vue'
import EditClipPath from './props/EditClipPath.vue'
import EditSize from './props/EditSize.vue'
import EditTransform from './props/EditTransform.vue'
import EditShadow from './props/EditShadow.vue'
import EditAnimation from './props/EditAnimation.vue'
import { TypeEnum } from '../../danke-core/elements/index'
import { Shapes } from '../../danke-core/css-model/shapeclip'
import EditMask from './props/EditMask'

export default {
  name: 'ElementConfig',
  props: {
    element: {
      type: Object
    },
    animations: {
      type: Array
    }
  },
  components: {
    EditMask,
    EditAnimation,
    EditTransform,
    EditSize,
    EditClipPath,
    EditBorder,
    EditBackground,
    EditPosition,
    EditShadow,
    EditFont
  },
  inject: ['moveUp', 'moveDown', 'moveTop', 'moveBottom', 'clipboard', 'cutElement', 'copyElement', 'pasteElement'],
  data () {
    return {
      animationType: 'in',
      shapeOptions: Shapes,
      TypeEnum,
      fileUrl: ''
    }
  },
  watch: {
    element: {
      deep: true,
      handler () {
        this.$emit('element-change')
      }
    }
  },
  computed: {
    tabsName () {
      return ['样式', '动画']
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
.element-prop-config {
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
      font-size: 14px;
      display: flex;
      width: 80px;
      justify-content: space-between;
      color: #333;
      .icon-paste {
        color: #999;
        &.has-clipboard {
          color: #333;
        }
      }
    }
  }
}
</style>
