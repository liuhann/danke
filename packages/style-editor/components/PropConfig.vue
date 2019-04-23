<template>
  <div class="prop-config box">
    <div class="tabs">
      <ul>
        <li v-for="tab in tabsName" :key="tab" :class="currentTab===tab? 'is-active': ''"><a @click="setTab(tab)">{{tab}}</a></li>
      </ul>
    </div>
    <div class="tabContent">
      <div class="basic panel" v-show="currentTab === '内容'">
        <form-field label="名称" v-model="element.name"></form-field>
        <form-field label="内容" v-model="element.text"></form-field>
        <form-field label="描述" v-model="element.desc"></form-field>
        <image-upload v-model="element.url"></image-upload>
        <div class="buttons">
          <span class="button icon-mobile is-small">保存为模板</span>
          <span class="button icon-laptop is-small">复制创建</span>
          <span class="button icon-laptop is-small is-danger">删除</span>
        </div>
      </div>

      <div class="position-config" v-show="currentTab==='位置'">
        <edit-position v-model="element.position"></edit-position>
        <edit-size v-model="element.size"></edit-size>
      </div>

      <div class="style-config" v-show="currentTab==='样式'">
        <edit-font v-model="element.font" ></edit-font>
        <edit-background v-model="element.background"></edit-background>
        <edit-border v-model="element.border"></edit-border>
        <edit-clip-path v-model="element.clip"></edit-clip-path>
      </div>

      <div class="animation-config" v-show="currentTab==='动画'">
        <edit-animation :animation="element.in" label="进入" animation-type="1"></edit-animation>
        <edit-animation :animation="element.dura" label="持续" animation-type="2"></edit-animation>
        <edit-animation :animation="element.out" label="离开" animation-type="3"></edit-animation>
      </div>
    </div>
  </div>
</template>

<script>
import EditFont from './EditFont'
import EditPosition from './EditPosition'
import EditBackground from './EditBackground'
import EditImage from './EditImage'
import EditBorder from './EditBorder'
import EditClipPath from './EditClipPath'
import EditSize from './EditSize'
import EditTransform from './EditTransform'
import ItemBlock from './ItemBlock'
import EditAnimation from './EditAnimation'
import FormField from '../../common/FormField'
import ImageUpload from './ImageUpload'

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
      fileUrl: '',
      currentTab: '内容',
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
      return ['内容', '样式', '位置', '动画']
    }
  },
  methods: {
    setTab(tab) {
      this.currentTab = tab
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
</style>
