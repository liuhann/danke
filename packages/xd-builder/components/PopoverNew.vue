<template>
<el-popover
  placement="left-start"
  trigger="click">
  <el-tabs size="small" value="first">
    <el-tab-pane label="基础" size="mini" name="first">
      <div class="new-scene pop-new-block">
        空白场景
      </div>
      <div class="clone-scene pop-new-block">
        复制场景
      </div> 
      <div class="ptb-10">场景</div>
       <el-button icon="el-icon-document-add" style="font-size: 16px;" size="mini" circle @click="addNewScene"/>
       <el-button icon="el-icon-document-copy" style="font-size: 16px;" size="mini" circle @click="cloneScene"/>
       <div class="ptb-10">基本元素</div>
       <div class="clone-scene pop-new-block">
        <el-upload
          style="float: left; margin-right: 10px;"
          :show-file-list="false"
          :auto-upload="false"
          action="nothing"
          :on-change="insertRawImage">
          <el-button icon="el-icon-picture-outline" style="font-size: 16px;" size="mini" circle />
          上传图片
        </el-upload>
       </div> 
       <div class="clone-scene pop-new-block">
        <i class="el-icon-files" />
         插入形状
       </div>
       <div class="clone-scene pop-new-block">
        <i class="el-icon-postcard" />
         文本
       </div>
       <div class="clone-scene pop-new-block">
        <i class="el-icon-headset" />
         音频
       </div> 
       <el-button icon="el-icon-files" size="mini" circle @click="insertShape('rect')"/>
       <el-button icon="el-icon-postcard" size="mini" circle @click="insertText"/>
       <el-button icon="el-icon-headset" size="mini" circle @click="openAudioDialog"/>
       <div class="ptb-10">插件</div>
       <div class="plugins is-clearfix">
         <el-upload
           style="float: left; margin-right: 10px;"
           :show-file-list="false"
           :auto-upload="false"
           action="nothing"
           :on-change="insertPaperFolding">
           <el-button icon="el-icon-s-grid" size="mini" circle/>
         </el-upload>
         <el-button icon="el-icon-coordinate" @click="showFlatIconPopover" size="mini" circle/>
       </div>
    </el-tab-pane>
    <el-tab-pane label="模板" size="mini" name="tpl">

    </el-tab-pane>
   </el-tabs>
  <el-button class="btn-add" icon="el-icon-plus" slot="reference" type="primary" size="mini" circle/>
</el-popover>
</template>

<script>
import { Popover, Button, Upload, Tabs, TabPane } from 'element-ui'
export default {
  name: 'Publish',
  components: {
    [Popover.name]: Popover,
    [Button.name]: Button,
    [Upload.name]: Upload,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane
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
  border: 1px solid #eee;
}

</style>