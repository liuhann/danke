<template>
  <div class="prop-config box">
    <div class="tabs">
      <ul>
        <li v-for="tab in tabsName" :key="tab" :class="currentTab===tab? 'is-active': ''"><a @click="setTab(tab)">{{tab}}</a></li>
      </ul>
    </div>
    <div class="tabContent">
      <div class="basic panel" v-show="currentTab === '样式'">
        <edit-font v-if="element.type === TypeEnum.TEXT" v-model="element.font"></edit-font>
        <form-field v-if="element.type === TypeEnum.SHAPE" v-model="element.shape" label="形状" :options="shapeOptions"></form-field>
        <edit-position v-model="element.position"></edit-position>
        <edit-size v-model="element.size"></edit-size>
        <edit-len v-model="element.position.z" label="Z" :with-unit="false"></edit-len>
        <a class="button is-text" v-if="!showMore" @click="showMore = !showMore">更多配置</a>
        <div class="show-more" v-if="showMore">
          <form-field v-if="element.type === TypeEnum.SHAPE || element.type === TypeEnum.IMAGE" label="阴影" v-model="element.shadow" :options="shadowType"></form-field>
          <edit-background v-model="element.background" v-if="element.type !== TypeEnum.TEXT"></edit-background>
          <edit-border v-model="element.border" v-if="element.type !== TypeEnum.TEXT"></edit-border>
          <edit-clip-path v-model="element.clip" v-if="element.type !== TypeEnum.TEXT"></edit-clip-path>
          <!--<form-field label="背景大小" type="select" v-css-model="element.background.size" :options="backgroundSizeOptions"></form-field>-->
          <div class="buttons">
            <span class="button icon-laptop is-small is-danger" @click="removeElement">删除</span>
          </div>
        </div>
      </div>
      <div class="animation-config" v-show="currentTab==='动画'">
        <edit-animation :animation="element.animation.in" label="进入" animation-type="1"></edit-animation>
        <edit-animation :animation="element.animation.dura" label="持续" animation-type="2"></edit-animation>
        <edit-animation :animation="element.animation.out" label="离开" animation-type="3"></edit-animation>
      </div>
    </div>
  </div>
</template>

<script>
import EditFont from './EditFont.vue'
import EditPosition from './EditPosition.vue'
import EditBackground from './EditBackground'
import EditImage from './EditImage'
import EditBorder from './EditBorder'
import EditClipPath from './EditClipPath.vue'
import EditSize from './EditSize.vue'
import EditTransform from './EditTransform'
import ItemBlock from './ItemBlock'
import EditAnimation from './EditAnimation'
import FormField from '../../common/components/FormField'
import ImageUpload from './ImageUpload'
import { TypeEnum } from '../../danke-core/css-model/element'
import EditLen from './EditLen'
import { boxShadows } from '../../danke-core/css-model/boxshadow'

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
    ImageUpload,
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
    },
    shapeOptions () {
      return {
        'rect': '方形',
        'circle': '圆形'
      }
    }

  },
  methods: {
    setTab(tab) {
      this.currentTab = tab
    },
    removeElement () {
      this.$emit('remove')
    }
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
