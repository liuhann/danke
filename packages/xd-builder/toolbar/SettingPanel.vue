<template>
  <el-popover v-model="visible" placement="bottom" width="360" trigger="click" popper-class="padding-0">
    <a slot="reference" class="action"><i class="el-icon-setting" /></a>
    <div class="setting-panel">
      <el-tabs stretch>
        <el-tab-pane label="场景">
          <el-form size="mini" label-width="80px">
            <el-form-item label="持续时间">
              <el-input-number v-model="scene.duration" controls-position="right" size="mini" />  秒
            </el-form-item>
            <el-form-item label="离开时间">
              <el-input-number v-model="scene.exit" controls-position="right" size="mini" />  秒
            </el-form-item>
            <el-form-item label="离开动画">
              <el-checkbox v-model="scene.renderExit">
                渲染
              </el-checkbox>
            </el-form-item>
            <el-form-item label="堆叠视角">
              <el-input-number v-model="scene.z" controls-position="right" size="mini" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="作品">
          <el-form size="mini" label-width="80px">
            <el-form-item label="作品名称">
              <el-input v-model="work.title" size="mini" />
            </el-form-item>
            <el-form-item label="标签">
              <el-select v-model="tags" size="mini" multiple filterable allow-create>
                <el-option v-for="tag of work.tags" :key="tag" :label="tag" :value="tag" />
              </el-select>
            </el-form-item>
            <el-form-item label="宽-高">
              <el-input-number v-model="work.viewBox.width" size="mini" controls-position="right" />
              <el-input-number v-model="work.viewBox.height" size="mini" controls-position="right" />
            </el-form-item>
            <el-form-item label="背景颜色">
              <el-color-picker v-model="work.color" />
            </el-form-item>
            <el-form-item label="背景音乐">
              {{work.audioName || '无'}} 
              <el-button type="text" @click="removeAudio">删除</el-button>
            </el-form-item>
            <el-form-item align="right" class="actions">
              <el-button type="success" size="small" @click="commitSaveWork">
                保存作品
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div v-if="!showShareScene && !showWorkForm" class="share-list" />
      <el-form v-if="showShareScene" size="mini" label-width="80px">
        <el-form-item label="模板名称">
          <el-input v-model="shareSceneName" size="mini" />
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="tags" size="mini" multiple filterable allow-create>
            <el-option v-for="tag of templateTags" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>
        <el-form-item label="背景色">
          <el-select v-model="tags" size="mini" multiple filterable allow-create>
            <el-option v-for="tag of templateTags" :key="tag" :label="tag" :value="tag" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="savingBlock" @click="commitShareScene">
            提交
          </el-button>
          <el-button @click="showShareScene = false">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-popover>
</template>

<script>
import workMixin from '../work/workMixin'
import toolbarPopMixin from './toolbarPopMixin'
import RestDAO from '../../utils/restdao.js'

const templateTags = ['图文', '图片']

export default {
  name: 'SettingPanel',
  mixins: [ workMixin, toolbarPopMixin ],
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

    removeAudio () {
      debugger
      this.work.audioUrl = null
      this.work.audioName = null
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
