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
        <form-field label="图片">
          <div class="file is-boxed">
            <label class="file-label">
              <input class="file-input" type="file" name="resume">
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-cloud-upload-alt"></i>
                </span>
                <span class="file-label">
                  选择文件
                </span>
              </span>
            </label>
          </div>
        </form-field>
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
        <edit-animation :animation="element.in" label="进入" :animations="animations"></edit-animation>
        <edit-animation :animation="element.dura" label="持续" :animations="animations"></edit-animation>
        <edit-animation :animation="element.out" label="离开" :animations="animations"></edit-animation>
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
      currentTab: '内容',
      activeNames: []
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
.el-radio {
  margin-right: 2px;
}

.config-basic {
  .el-input__inner, .el-textarea__inner {
    width: 200px;
  }
}

.el-input--mini {
  .el-input__inner {
    padding: 0 5px;
  }
  .el-textarea__inner {
    padding: 5px;
  }
}

.el-select  {
  .el-input__inner {
    padding-left: 5px;
    padding-right: 25px;
  }
}

.el-checkbox {
  margin-right: 2px;
}
.el-input-number--mini {
  width: 100px;
}
.el-collapse-item__header {
  padding-left: 10px;
  font-size: 13px;
  text-align: left;
  color: #585858;
  font-weight: bold;
  height: 36px;
  line-height: 36px;
}
.el-collapse-item__content {
  padding-bottom: 5px;
}
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
