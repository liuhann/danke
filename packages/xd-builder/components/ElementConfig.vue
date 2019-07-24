<template>
<nav class="element-prop-config">
  <p class="panel-heading">
    元素配置
  </p>
  <div class="panel-body">
    <edit-font v-if="element.font" v-model="element.font"></edit-font>
    <edit-background v-model="element.background" v-if="element.type !== TypeEnum.TEXT"></edit-background>
    <edit-position v-model="element.position"></edit-position>
    <edit-size v-model="element.size"></edit-size>
    <edit-border v-model="element.border" v-if="element.border"></edit-border>
    <edit-shadow v-model="element.shadow" v-if="element.shadow"></edit-shadow>
    <edit-clip-path v-model="element.clip" v-if="element.clip"></edit-clip-path>
    <hr/>
    <edit-animation :animation="element.animation.in" animation-type="in" :icon="SVG_IN"></edit-animation>
    <edit-animation :animation="element.animation.dura" animation-type="dura" :icon="SVG_DURA"></edit-animation>
    <edit-animation :animation="element.animation.out" animation-type="out" :icon="SVG_OUT"></edit-animation>
    <!--<form-field label="背景大小" type="select" v-css-model="element.background.size" :options="backgroundSizeOptions"></form-field>-->
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
import SVG_DURA from '../svg/loading.svg'
import SVG_IN from '../svg/login.svg'
import SVG_OUT from '../svg/logout.svg'

export default {
  name: 'ElmentConfig',
  props: {
    element: {
      type: Object
    },
    animations: {
      type: Array
    }
  },
  components: {
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
  data () {
    return {
      SVG_DURA,
      SVG_IN,
      SVG_OUT,
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
#element-prop-config {
  width: 320px;
  .panel-body {
    padding: 10px;
    border: 1px solid #ccc;
    border-top: none;
  }
  .desc {
    height: 60px;
  }
  .image-display {
    width: 220px;
    height: 90px;
    background-color: #efefef;
  }
  .upload {
    height: 100px;
    .el-upload {
      display: inherit;
      text-align: center;
      cursor: pointer;
      outline: 0;
      padding: 25px;
    }
  }
}
</style>
