<template>
	<el-popover
	  placement="left-start"
	  @show="addPopoverShow"
	  width="260"
	  trigger="click">
	  <el-tabs size="small" value="first">
	     <el-tab-pane label="基础" size="mini" name="first">
	       <div class="ptb-10">场景</div>
	       <el-button icon="el-icon-document-add" style="font-size: 16px;" size="mini" circle @click="addNewScene"/>
	       <el-button icon="el-icon-document-copy" style="font-size: 16px;" size="mini" circle @click="cloneScene"/>
	       <div class="ptb-10">基本元素</div>
	       <el-upload
	         style="float: left; margin-right: 10px;"
	         :show-file-list="false"
	         :auto-upload="false"
	         action="nothing"
	         :on-change="insertRawImage">
	         <el-button icon="el-icon-picture-outline" style="font-size: 16px;" size="mini" circle />
	       </el-upload>
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
	       </div>
	     </el-tab-pane>
	     <el-tab-pane label="模板" name="second">
	                   
	     </el-tab-pane>
	   </el-tabs>
	  <el-button class="btn-add" icon="el-icon-plus" slot="reference" type="primary" size="mini" circle/>
	</el-popover>  
</template>

<script>
export default {
  name: 'Publish'
}
</script>

<style scoped>

</style>