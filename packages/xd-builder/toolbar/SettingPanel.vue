<template>
<el-popover placement="bottom" width="360" trigger="click" popper-class="padding-0" v-model="visible">
  <a class="action" slot="reference"><i class="el-icon-setting"/></a>
  <div class="setting-panel">
    <div class="share-list" v-if="!showShareScene && !showWorkForm">
      <el-form size="mini" label-width="80px">
        <el-form-item label="作品名称">
          <el-input size="mini" v-model="work.title"/>
        </el-form-item>
        <el-form-item label="标签">
          <el-select size="mini" v-model="tags" multiple filterable allow-create>
            <el-option v-for="tag of work.tags" :key="tag" :label="tag" :value="tag"/>
          </el-select>
        </el-form-item>
        <el-form-item align="right" class="actions">
          <el-checkbox v-model="work.isBlock" true-label="yes" false-label="no">设置为图块</el-checkbox>
          <el-button type="success" @click="commitSaveWork" size="small">保存作品</el-button>
        </el-form-item>
      </el-form>
      <el-divider content-position="left" >调整长宽</el-divider>
      <el-form size="mini" :inline="true">
        <el-form-item label="宽">
          <el-input-number size="mini" v-model="viewBox.width" controls-position="right"/>
        </el-form-item>
        <el-form-item label="长">
          <el-input-number size="mini" v-model="viewBox.height" controls-position="right"/>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button @click="resizeWorkViewBox">确定</el-button>
        </el-form-item>
      </el-form>
      <div class="share" @click="slidePreview">
        <div class="icon">
          <i class="el-icon-full-screen" />
        </div>
        <div class="name">新页面预览</div>
        <div class="extra"></div>
      </div>
      <div class="share">
        <div class="icon"></div>
        <div class="name">长页面预览</div>
        <div class="extra"></div>
      </div>
    </div>
    <el-form size="mini" v-if="showShareScene" label-width="80px">
      <el-form-item label="模板名称">
        <el-input size="mini" v-model="shareSceneName"/>
      </el-form-item>
      <el-form-item label="标签">
        <el-select size="mini" v-model="tags" multiple filterable allow-create>
          <el-option v-for="tag of templateTags" :key="tag" :label="tag" :value="tag"/>
        </el-select>
      </el-form-item>
      <el-form-item label="背景色">
        <el-select size="mini" v-model="tags" multiple filterable allow-create>
          <el-option v-for="tag of templateTags" :key="tag" :label="tag" :value="tag"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="commitShareScene" :loading="savingBlock">提交</el-button>
        <el-button @click="showShareScene = false">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</el-popover>

</template>

<script>
import workMixin from '../work/workMixin'
import { Input, Select, Option, Popover, Button, Form, FormItem, Notification, Checkbox, InputNumber, Divider } from 'element-ui'
import RestDAO from '../../common/dao/restdao'

const templateTags = ['图文', '图片']

export default {
  name: 'SettingPanel',
  mixins: [ workMixin ],
  components: {
    [Popover.name]: Popover,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
    [Button.name]: Button,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Checkbox.name]: Checkbox,
    [InputNumber.name]: InputNumber,
    [Divider.name]: Divider
  },
  props: {
    work: {
      type: Object
    },
    scene: {
      type: Object
    }
  },
  data () {
    return {
      viewBox: JSON.parse(JSON.stringify(this.work.viewBox)),
      visible: false,
      tags: [],
      templateTags,
      savingBlock: false,
      shareSceneName: '',
      showShareScene: false,
      showWorkForm: false
    }
  },

  created () {
    this.blockdao = new RestDAO(this.ctx, 'danke/block')
  },
  methods: {
    async resizeWorkViewBox () {
      this.work.viewBox = this.viewBox
      await this.saveWork()
    },

    async commitSaveWork () {
      await this.saveWork()
      Notification.success({
        message: '保存作品信息成功'
      })
      this.visible = false
    },

    async commitShareScene () {
      const frames = {}
      const svgs = {}
      const fonts = new Set()
      this.ctx.styleRegistry.assignSceneResource(this.scene, frames, svgs, fonts)

      const sceneImage = JSON.parse(JSON.stringify(this.scene))
      sceneImage.frames = frames
      sceneImage.svgs = svgs
      sceneImage.fonts = Array.from(fonts)
      sceneImage.name = this.shareSceneName
      sceneImage.tags = this.tags
      sceneImage.viewBox = this.work.viewBox
      this.savingBlock = true
      await this.blockdao.create(sceneImage)
      this.savingBlock = false
      Notification.success({
        message: '保存模板成功'
      })
      this.showShareScene = false
      this.visible = false
    },
    editWorkForm () {
      this.showWorkForm = true
    },

    shareSceneAsTemplate () {
      this.showShareScene = true
    }
  }
}
</script>

<style lang="scss">
.setting-panel {
  .share-list {
    .share {
      display: flex;
      height: 4rem;
      line-height: 4rem;
      font-size: 1.5rem;
      color: #293039;
      flex: 1;
      cursor: pointer;
      &:hover {
        background-color: rgba(14,19,24,.07);
      }
      .icon {
        font-weight: bold;
        width: 4rem;
        text-align: center;
        font-size: 2rem;
      }
    }
  }

  .el-form {
    .actions {
      .el-checkbox {
        float: left;
      }
    }
    .el-input-number {
      width: 96px;
    }
  }
}

</style>
