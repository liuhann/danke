<template>
  <div class="style-config">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="基础" size="mini" name="basic" class="config-basic">
        <item-block title="名称">
          <el-input size="mini" v-model="element.name"></el-input>
        </item-block>
        <item-block title="内容">
          <el-input size="mini" v-model="element.text"></el-input>
        </item-block>
        <item-block title="描述" class="desc">
          <el-input size="mini" type="textarea" v-model="element.desc"></el-input>
        </item-block>
        <item-block title="图片" class="upload">
          <edit-image v-model="element.url" @file-add="$emit('file-add', $event)" @file-remove="$emit('file-remove', $event)"></edit-image>
        </item-block>
      </el-collapse-item>
      <el-collapse-item title="动画" size="mini" name="animation">
        <edit-animation :animation="element.in" label="进入" :animations="animations"></edit-animation>
        <edit-animation :animation="element.dura" label="持续" :animations="animations"></edit-animation>
        <edit-animation :animation="element.out" label="离开" :animations="animations"></edit-animation>
      </el-collapse-item>
      <el-collapse-item title="字体" size="mini" name="font">
        <edit-font v-model="element.font" ></edit-font>
      </el-collapse-item>
      <el-collapse-item title="大小" size="mini" name="size">
        <edit-size v-model="element.size"></edit-size>
      </el-collapse-item>
      <el-collapse-item title="位置" size="mini" name="position">
        <edit-position v-model="element.position"></edit-position>
      </el-collapse-item>
      <el-collapse-item title="背景" size="mini" name="background">
        <edit-background v-model="element.background" @file-add="$emit('file-add', $event)" @file-remove="$emit('file-remove', $event)"></edit-background>
      </el-collapse-item>
      <el-collapse-item title="边框" size="mini" name="border">
        <edit-border v-model="element.border"></edit-border>
      </el-collapse-item>
      <el-collapse-item title="裁剪" size="mini" name="clip">
        <edit-clip-path v-model="element.clip"></edit-clip-path>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import Vue from 'vue'
import EditFont from './EditFont'
import EditPosition from './EditPosition'
import { Button, ButtonGroup, InputNumber, ColorPicker, Radio, Select, Option, Checkbox, Collapse, CollapseItem, Upload, Input, Tabs, TabPane } from 'element-ui'
import EditBackground from './EditBackground'
import EditImage from './EditImage'
import EditBorder from './EditBorder'
import EditClipPath from './EditClipPath'
import EditSize from './EditSize'
import EditTransform from './EditTransform'
import ItemBlock from './ItemBlock'
import EditAnimation from './EditAnimation'

Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(InputNumber)
Vue.use(ColorPicker)
Vue.use(Radio)
Vue.use(Select)
Vue.use(Option)
Vue.use(Checkbox)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Upload)
Vue.use(Input)
Vue.use(Tabs)
Vue.use(TabPane)

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
      activeNames: []
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
