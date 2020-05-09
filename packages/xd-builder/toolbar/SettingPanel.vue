<template>
<el-popover placement="bottom" width="320" trigger="click" popper-class="padding-0" v-model="visible">
  <a class="action" slot="reference"><icon-share /></a>
  <div class="setting-panel">
    <div class="share-list" v-if="!showShareScene">
      <div class="share" @click="slidePreview">
        <div class="icon">
          <i class="el-icon-full-screen" />
        </div>
        <div class="name">新页面预览</div>
        <div class="extro"></div>
      </div>
      <div class="share" @click="shareSceneAsTemplate">
        <div class="icon">
          <i class="el-icon-chat-dot-round" />
        </div>
        <div class="name">分享场景为模板</div>
        <div class="extro"></div>
      </div>
      <div class="share">
        <div class="icon"></div>
        <div class="name">分享为作品模板</div>
        <div class="extro"></div>
      </div>
      <div class="share">
        <div class="icon"></div>
        <div class="name">长页面预览</div>
        <div class="extro"></div>
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
      <el-form-item>
        <el-button type="primary" @click="commitShareScene" :loading="savingBlock">提交</el-button>
        <el-button @click="showShareScene = false">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</el-popover>

</template>

<script>
import IconShare from './res/share.svg'
import { Input, Select, Option, Popover, Button, Form, FormItem, Notification } from 'element-ui'
import RestDAO from '../../common/dao/restdao'

const templateTags = ['图文', '图片']

export default {
  name: 'SettingPanel',
  components: {
    IconShare,
    [Popover.name]: Popover,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
    [Button.name]: Button,
    [Form.name]: Form,
    [FormItem.name]: FormItem
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
      visible: false,
      tags: [],
      templateTags,
      savingBlock: false,
      shareSceneName: '',
      showShareScene: false
    }
  },

  created () {
    this.blockdao = new RestDAO(this.ctx, 'danke/block')
  },
  methods: {
    slidePreview () {
      window.open('/slide/' + this.work.id)
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
}

</style>
