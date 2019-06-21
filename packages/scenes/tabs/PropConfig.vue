<template>
<div class="prop-config">
  <div v-if="element">
    <edit-font v-if="element.font" v-model="element.font"></edit-font>
    <form-field v-if="element.shape" v-model="element.shape" label="形状" type="select" :options="shapeOptions"></form-field>
    <edit-position v-model="element.position"></edit-position>
    <edit-size v-model="element.size"></edit-size>
    <edit-animation :animation="element.animation.in" label="进入" animation-type="1"></edit-animation>
    <div class="show-more" v-if="showMore">
      <form-field v-if="element.type === TypeEnum.SHAPE || element.type === TypeEnum.IMAGE" label="阴影" v-model="element.shadow" :options="shadowType"></form-field>
      <edit-animation :animation="element.animation.dura" label="持续" animation-type="2"></edit-animation>
      <edit-animation :animation="element.animation.out" label="离开" animation-type="3"></edit-animation>
      <edit-background v-model="element.background" v-if="element.type !== TypeEnum.TEXT"></edit-background>
      <edit-border v-model="element.border" v-if="element.type !== TypeEnum.TEXT"></edit-border>
      <edit-clip-path v-model="element.clip" v-if="element.clip"></edit-clip-path>
      <!--<form-field label="背景大小" type="select" v-css-model="element.background.size" :options="backgroundSizeOptions"></form-field>-->
    </div>
    <a class="button is-text" @click="showMore = !showMore">{{showMore? '折叠': '更多配置'}}</a>
  </div>
  <div v-else>
    请选择元素
  </div>
</div>
</template>

<script>
import EditFont from '../components/EditFont.vue'
import EditPosition from '../components/EditPosition.vue'
import EditBackground from '../components/EditBackground.vue'
import EditImage from '../components/EditImage.vue'
import EditBorder from '../components/EditBorder.vue'
import EditClipPath from '../components/EditClipPath.vue'
import EditSize from '../components/EditSize.vue'
import EditTransform from '../components/EditTransform.vue'
import ItemBlock from '../components/ItemBlock.vue'
import EditAnimation from '../components/EditAnimation.vue'
import FormField from '../../common/components/FormField.vue'
import { TypeEnum } from '../../danke-core/css-model/element'
import EditLen from '../components/EditLen'
import { boxShadows } from '../../danke-core/css-model/boxshadow'
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
    EditLen,
    FormField,
    EditAnimation,
    ItemBlock,
    EditTransform,
    EditSize,
    EditClipPath,
    EditBorder,
    EditBackground,
    EditPosition,
    EditImage,
    EditFont
  },
  data () {
    return {
      shadowType: boxShadows,
      shapeOptions: Shapes,
      TypeEnum,
      showMore: false,
      fileUrl: '',
      currentTab: '样式',
      activeNames: []
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
.style-config {
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

@media screen and (max-width: 768px) {
  /*.style-config {
    .column {
      padding: 0!important;
    }
    .box {
      padding: 10px;
    }
    .field {
      display: flex;
    }
    .field-label {
      font-size: 14px;
      font-weight: 200;
      margin-bottom: 0;
      margin-right: 6px;
      width: 65px;
    }
  }*/
}

</style>
