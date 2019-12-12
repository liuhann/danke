<template>
<el-popover
  :width="420"
  placement="left-start"
  trigger="click">
  <div class="is-clearfix">
    <div class="new-scene pop-new-block" @click="$emit('insert', 'scene')">
      <i class="el-icon-document-add" />
      <span>空白场景</span>
    </div>
    <div class="clone-scene pop-new-block" @click="$emit('insert', 'clone-scene')">
      <i class="el-icon-document-copy" />
      <span>复制场景</span>
    </div>
    <div class="clone-scene pop-new-block" @click="$emit('insert', 'back-audio')">
      <i class="el-icon-headset" />
      <span>背景音频</span>
    </div>
  </div>
  <div class="is-clearfix">
    <div class="ptb-10">基本元素</div>
    <div class="clone-scene pop-new-block">
      <el-upload
        :show-file-list="false"
        :auto-upload="false"
        action="nothing"
        accept="image/*"
        :on-change="imageFileChosed">
        <i class="el-icon-picture-outline" />
        <div>上传图片</div>
      </el-upload>
    </div>
    <div class="clone-scene pop-new-block" @click="$emit('insert', 'shape')">
      <i class="el-icon-files" />
      <span>插入形状</span>
    </div>
   <div class="clone-scene pop-new-block" @click="$emit('insert', 'text')">
    <i class="el-icon-postcard" />
     <span>文本</span>
   </div>
  </div>
  <div class="ptb-10">插件</div>
   <div class="plugins is-clearfix">
     <el-upload
       style="float: left; margin-right: 10px;"
       :show-file-list="false"
       :auto-upload="false"
       action="nothing"
       :on-change="paperFoldImageChoosed">
       <el-button icon="el-icon-s-grid" size="mini" circle/>
     </el-upload>
     <div class="clone-scene pop-new-block" @click="">
       <i class="el-icon-goods" />
       <span>模板元素</span>
     </div>
     <div class="pop-new-block" @click="showFlatIconPopover">
       <i class="el-icon-coordinate" />
       <span>Flat图标</span>
     </div>
     <dialog-choose-flat-icon ref="dialogChooseFlatIcon" @input="flatIconChoosed" />
   </div>
  <el-button class="btn-add" icon="el-icon-plus" slot="reference" type="primary" size="mini" circle/>
</el-popover>
</template>

<script>
import { Popover, Button, Upload, Tabs, TabPane, Dialog } from 'element-ui'
import DialogChooseFlatIcon from '../../flaticon/DialogChooseFlatIcon'
export default {
  name: 'Publish',
  components: {
    DialogChooseFlatIcon,
    [Popover.name]: Popover,
    [Button.name]: Button,
    [Upload.name]: Upload,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    [Dialog.name]: Dialog
  },
  data () {
    return {
    }
  },
  methods: {
    imageFileChosed (file) {
      this.$emit('insert', 'image', file.raw)
    },

    paperFoldImageChoosed (file) {
      this.$emit('insert', 'paper', file.raw)
    },

    flatIconChoosed (icon) {
      this.$emit('insert', 'svg', icon)
    },

    showFlatIconPopover () {
      this.$refs.dialogChooseFlatIcon.open()
    },

    audioFileChoosed (file) {
      this.$emit('insert', 'audio', file.raw)
    }
  }
}
</script>

<style lang="scss">
.pop-new-block {
  float: left;
  display: flex;
  margin: 4px;
  flex-direction: column;
  width: 120px;
  text-align: center;
  font-size: 14px;
  justify-content: center;
  height: 68px;
  border: 1px solid #DCDFE6;
  color: #606266;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    color: #409EFF;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
  }
  [class*=" el-icon-"], [class^=el-icon-] {
    font-size: 22px;
    margin-bottom: 6px;
  }
}

</style>
