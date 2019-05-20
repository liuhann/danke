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
        <form-field label="内容" v-if="element.type === TypeEnum.TEXT" v-model="element.text"></form-field>
        <form-field label="描述" v-model="element.desc"></form-field>
        <edit-position v-model="element.position"></edit-position>
        <edit-size v-model="element.size" :ratioFixed="true"></edit-size>
        <!--<form-field label="背景大小" type="select" v-model="element.background.size" :options="backgroundSizeOptions"></form-field>-->
        <div class="buttons">
          <span class="button icon-laptop is-small is-danger" @click="removeElement">删除</span>
        </div>
      </div>

      <div class="position-config" v-show="currentTab==='位置'">
      </div>

      <div class="style-config" v-show="currentTab==='样式'">
        <edit-font v-model="element.font" v-if="element.type === TypeEnum.TEXT"></edit-font>
        <edit-background v-model="element.background" v-if="element.type === TypeEnum.IMAGE"></edit-background>
        <edit-border v-model="element.border"></edit-border>
        <edit-clip-path v-model="element.clip" v-if="element.type !== TypeEnum.TEXT"></edit-clip-path>
      </div>
`
      <div class="animation-config" v-show="currentTab==='动画'">
        <edit-animation :animation="element.in" label="进入" animation-type="1"></edit-animation>
        <edit-animation :animation="element.dura" label="持续" animation-type="2"></edit-animation>
        <edit-animation :animation="element.out" label="离开" animation-type="3"></edit-animation>
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
import { TypeEnum } from '../../danke-core/model/element'

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
      TypeEnum,
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
      return ['内容', '样式', '动画']
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
