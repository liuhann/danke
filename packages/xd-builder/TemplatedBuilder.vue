<template>
<div id="templated-builder">
  <div class="scene-container">
    <div class="device" ref="device" v-if="currentScene" :style="currentScene.style">
      <render-element
        v-for="(element, index) of currentScene.elements"
        :element="element"
        :key="element.id"
        :index="index"
        @click="setElement(element, $event)"/>
    </div>
    <div class="scene-options">
      <span class="tag is-info page-info">{{work.scenes.indexOf(currentScene)+1}}/{{work.scenes.length}}</span>
      <el-button icon="el-icon-arrow-left" class="btn-prev" circle @click="previousScene"></el-button>
      <el-button icon="el-icon-arrow-right" class="btn-next" circle @click="nextScene"></el-button>
      <el-button class="btn-save" type="success" size="mini" round @click="saveWork">保存</el-button>
      <el-button class="btn-preview" type="info" size="mini" round>预览</el-button>
    </div>
  </div>
  <el-dialog
    title="更换元素"
    :visible.sync="dialogVisible"
    width="80%">
    <el-upload v-if="currentElement && currentElement.type === 1"
      :on-change="fileChoosed"
      action="nothing"
      :show-file-list="false"
      :auto-upload="false">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    </el-upload>
    <el-button v-if="currentElement && currentElement.type === 2" size="small" @click="$refs.dialogEditText.open(currentElement.text)">编辑文字</el-button>
  </el-dialog>
  <dialog-edit-text ref="dialogEditText" @input="setElementText"></dialog-edit-text>
</div>
</template>

<script>
import RenderElement from './RenderElement.vue'
import { Dialog, Button, Upload, Loading } from 'element-ui'
import ImageDAO from '../common/dao/imagedao'
import RestDAO from '../common/dao/restdao'
import sceneMixin from './mixins/sceneMixins'
import saveShareMixin from './mixins/saveShare'
import { shortid } from '../utils/string'
import DialogEditText from './components/DialogEditText'
export default {
  name: 'TemplatedBuilder',
  mixins: [ sceneMixin, saveShareMixin ],
  components: {
    DialogEditText,
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    [Upload.name]: Upload,
    RenderElement
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },
  mounted () {
    const work = this.$route.query.work
    this.fetchWork(work)
  },
  data () {
    return {
      // 作品概要信息
      work: {
        ratio: '',
        id: '',
        title: '',
        categories: [],
        desc: '',
        audioUrl: '',
        audioName: '',
        audioTicks: [],
        duration: 0,
        resources: [],
        scenes: []
      },
      device: {
        width: 320,
        height: 640
      },
      currentScene: {},
      currentElement: null,
      dialogVisible: false
    }
  },
  methods: {
    async fetchWork (workId) {
      const work = await this.workdao.getOne(workId)
      this.device = {
        width: window.innerWidth,
        height: window.innerHeight
      }
      this.openWork(work)
      this.work.id = shortid()
      this.work.isNew = true
      this.chooseScene(this.work.scenes[0])
      this.renderScene(this.currentScene, 'in')
    },
    setElement (element) {
      this.currentElement = element
      this.dialogVisible = true
    },
    setElementText (htmlText) {
      this.currentElement.text = htmlText
      this.dialogVisible = false
    },
    async fileChoosed (file) {
      this.dialogVisible = false
      if (file.raw) {
        let loadingInstance = Loading.service({ fullscreen: true, text: '上传图片中' });
        const result = await this.imagedao.uploadBlob(file.raw, this.work.id)
        this.currentElement.imgPath = result.name
        loadingInstance.close()
        this.renderScene(this.currentScene, 'in')
      }
    }
  }
}
</script>

<style lang="scss">
#templated-builder {
  .device {
    .element {
      overflow: hidden;
    }
  }
  .scene-options {
    .page-info {
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
    .btn-prev {
      position: absolute;
      left: 10px;
      top: calc(50% - 10px)
    }
    .btn-next {
      position: absolute;
      right: 10px;
      top: calc(50% - 10px)
    }
    .btn-save {
      position: absolute;
      right: 70px;
      top: 10px;
    }
    .btn-preview {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
}
</style>
