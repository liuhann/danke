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
    </div>
  </div>
  <el-dialog
    title="更换元素"
    :visible.sync="dialogVisible"
    width="80%">
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
      <button @click="dialogVisible = false">取 消</button>
      <button type="primary" @click="dialogVisible = false">确 定</button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import RenderElement from './RenderElement.vue'
import { Dialog, Button } from 'element-ui'
import ImageDAO from '../common/dao/imagedao'
import RestDAO from '../common/dao/restdao'
import sceneMixin from './mixins/sceneMixins'
import saveShareMixin from './mixins/saveShare'
import { shortid } from '../utils/string'
export default {
  name: 'TemplatedBuilder',
  mixins: [ sceneMixin, saveShareMixin ],
  components: {
    [Dialog.name]: Dialog,
    [Button.name]: Button,
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
  }
}
</style>
