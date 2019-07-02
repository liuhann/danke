<template>
<div id="prop-config">
  <div v-if="element">
    <edit-font v-if="element.font" v-model="element.font"></edit-font>
    <form-field v-if="element.shape" v-model="element.shape" label="形状" type="select" :options="shapeOptions"></form-field>
    <edit-background v-model="element.background" v-if="element.type !== TypeEnum.TEXT"></edit-background>
    <edit-position v-model="element.position"></edit-position>
    <edit-size v-model="element.size"></edit-size>
    <edit-border v-model="element.border" v-if="element.border"></edit-border>
    <edit-clip-path v-model="element.clip" v-if="element.clip"></edit-clip-path>
    <div class="tabs is-small">
      <ul>
        <li v-for="(key, index) of animatoinTabs" :class="[index===animationIndex? 'is-active': '']" :key="key">
          <a @click="animationIndex = index">{{animatoinTabsName[index]}}</a>
        </li>
      </ul>
    </div>
    <edit-animation :animation="element.animation[animatoinTabs[animationIndex]]" :animation-type="animatoinTabs[animationIndex]"></edit-animation>
    
      <!--<form-field label="背景大小" type="select" v-css-model="element.background.size" :options="backgroundSizeOptions"></form-field>-->
  </div>
  <div v-else>
    请选择元素
  </div>
</div>
</template>

<script>
import EditFont from './props/EditFont.vue'
import EditPosition from './props/EditPosition.vue'
import EditBackground from './props/EditBackground.vue'
import EditBorder from './props/EditBorder.vue'
import EditClipPath from './props/EditClipPath.vue'
import EditSize from './props/EditSize.vue'
import EditTransform from './props/EditTransform.vue'
import EditAnimation from './props/EditAnimation.vue'
import { TypeEnum } from '../../danke-core/css-model/element'
import { Shapes } from '../../danke-core/css-model/shapeclip'

export default {
  name: 'PropConfig',
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
    EditFont
  },
  data () {
    return {
      animatoinTabs: ['in', 'dura', 'out'],
      animatoinTabsName: ['进入效果', '持续效果', '离开效果'],
      animationIndex: 0,
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
#prop-config {
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
