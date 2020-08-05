<template>
  <div id="scene-list">
    <div v-show="!showSetting" class="actions">
      <el-button size="mini" type="success" @click="addScene">新增场景</el-button>
    </div>
    <div v-show="showSetting" class="actions">
      <el-button size="mini" type="success" @click="showSetting=false">关闭</el-button>
    </div>
    <el-form v-show="showSetting" size="mini" label-width="80px">
      <el-form-item label="持续时间">
        <el-input-number v-model="current.duration" controls-position="right" size="mini" />  秒
      </el-form-item>
      <el-form-item label="离开时间">
        <el-input-number v-model="current.exit" controls-position="right" size="mini" />  秒
      </el-form-item>
      <el-form-item label="离开动画">
        <el-checkbox v-model="current.renderExit">
          渲染
        </el-checkbox>
      </el-form-item>
      <el-form-item label="堆叠视角">
        <el-input-number v-model="current.z" controls-position="right" size="mini" />
      </el-form-item>
    </el-form>
    <draggable v-show="!showSetting" v-model="work.scenes" class="list-wrapper">
      <div v-for="(scene, index) in work.scenes" :key="scene._id" class="list-item" :class="(scene === current || scene.checked)? 'current': ''" :style="{
        width: viewPort.width + 'px',
        height: viewPort.height + 'px'
      }"
      >
        <div :style="{
               background: work.color
             }"
             class="scene-wrapper"
        >
          <render-scene :scene="scene" :view-box="work.viewBox" :view-port="viewPort" @click="chooseScene(scene)" />
          <div class="hovers">
            <el-button size="mini" circle type="info" icon="el-icon-edit" @click="editScene(index)" />
            <el-button size="mini" circle type="info" icon="el-icon-document-copy" @click="copyScene(index)" />
            <el-button size="mini" circle type="danger" icon="el-icon-delete" @click="deleteScene(index)" />
          </div>
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import sceneMixins from '../mixins/sceneMixins'
import workMixin from '../work/workMixin'
import RenderScene from '../render/RenderScene.vue'
import { shortid } from '../../utils/string'
import ImageDAO from '../../utils/imagedao'
export default {
  name: 'SceneList',
  components: {
    RenderScene,
    draggable
  },
  mixins: [ sceneMixins, workMixin ],
  props: {
    work: {
      type: Object
    },
    current: {
      type: Object
    }
  },
  data () {
    return {
      showSetting: false,
      markStart: 0,
      markEnd: 0,
      audioStartPoint: 0,
      audioDragging: false,
      audioEndPoint: 0,
      audioPlaying: false,
      audioTotalSeconds: 0,
      audioCurrentSeconds: 0
    }
  },
  computed :{
    isNewAudio () {
      if (this.work.audioUrl && this.work.audioUrl.startsWith('blob:')) {
        return true
      } else {
        return false
      }
    },
    marks () {
      if (this.isNewAudio) {
        return {
          [this.markStart]: '',
          [this.markEnd]: '',
        }
      } else {
        return {}
      }
    },
    viewPort () {
      let vp = {
        height: 190 * this.work.viewBox.height / this.work.viewBox.width,
        width: 190
      }
      if (vp.height > 300) {

      }
      return vp
    },
    checkedScenes () {
      return this.work.scenes.filter(scene => scene.checked)
    }
  },

  mounted () {
    if (this.work.audioUrl) {
      this.loadAudio(this.work.audioUrl)
    }
  },
  created () {
    this.mediadao = new ImageDAO(this.ctx)
  },
  methods: {
    async removeAudio () {
      this.audioInstance.pause()
      await this.mediadao.removeBlob(new URL(this.work.audioUrl).pathname)
      this.audioFile = null
      this.work.audioUrl = null
      this.work.audioName = null
      this.audioInstance = null
      this.audioPlaying = false
      this.markStart = 0
      this.markEnd = 0
      await this.saveWork()
    },

    async cutAndUseAudio () {
      const result = await this.mediadao.uploadAndCutMp3(this.audioFile, '15011245191/audios/' + shortid(10) + '.' + this.fileExtension(this.audioFile.name), this.markStart, this.markEnd)
      this.audioInstance.pause()
      this.audioFile = null
      this.work.audioUrl = result.url
      await this.saveWork()
      // this.audioInstance = new Audio(result.name)
    },
    setSceneTurn () {

    },
    setClipStart () {
      this.markStart = this.audioCurrentSeconds

      if (this.markStart > this.markEnd) {
        this.markEnd = this.audioTotalSeconds
      }
    },
    setClipEnd () {
      this.markEnd = this.audioCurrentSeconds
      if (this.markStart > this.markEnd) {
        this.markStart = 0
      }
    },
    audioCurrentChange (time) {
      this.audioInstance.currentTime = time
      this.audioCurrentSeconds = time
    },
    deleteScene (index) {
      if (this.work.scenes.length === this.checkedScenes.length) {
        MessageBox.prompt('不能将所有场景删除，请至少保留一个场景')
        return
      }
      this.work.scenes.splice(index, 1)
    },

    copyScene (index) {
      const cloned = JSON.parse(JSON.stringify(this.work.scenes[index]))
      cloned.id = shortid()
      this.work.scenes.splice(index, 0, cloned)
    },

    editScene () {
      this.showSetting = true
    },

    moveSceneNext (index) {
      const current = this.work.scenes[index]
      this.$set(this.work.scenes, index, this.work.scenes[index + 1])
      this.$set(this.work.scenes, index + 1, current)
    },
    moveScenePrev (index) {
      const current = this.work.scenes[index]
      this.$set(this.work.scenes, index, this.work.scenes[index - 1])
      this.$set(this.work.scenes, index - 1 , current)
    },

    loadAudio (url) {
      this.audioInstance = new Audio(url)
      this.audioInstance.onloadedmetadata = () => {
        this.audioTotalSeconds = this.audioInstance.duration
        this.markEnd = this.audioTotalSeconds
      }
      this.audioInstance.ontimeupdate = () => {
        if (this.$refs.slider && !this.$refs.slider.dragging) {
          this.audioCurrentSeconds = this.audioInstance.currentTime
        }
      }
      this.audioInstance.onended = () => {
        this.audioPlaying = false
      }
      this.audioInstance.load()
    },

    audioFileChoosed (file) {
      if (this.audioFile) {
        this.audioFile.pause()
      }
      this.audioFile = file.raw
      this.$set(this.work, 'audioUrl', URL.createObjectURL(this.audioFile))
      this.work.audioName = this.audioFile.name
      this.loadAudio(this.work.audioUrl)
    },

    audioPlay () {
      this.audioInstance.play()
      this.audioPlaying = true
    },

    audioPause () {
      this.audioInstance.pause()
      this.audioPlaying = false
    },

    formatAudioSecond (second) {
      return new Date(second * 1000).toISOString().replace(/.*(\d{2}:\d{2}.\d{2}).*/, "$1");
    },

    chooseScene (scene) {
      this.$emit('choose-scene', scene)
      this.$emit('close')
    },
    close () {
      if (this.work.scenes.filter(scene => scene === this.current).length === 0) {
        this.$emit('choose-scene', this.work.scenes[0])
      }
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
#scene-list {
  background-color: rgba(255, 255, 255, 1);
  height: 100vh;
  .actions {
    padding: 10px 20px;
    background: #fff;
    display: flex;
    .music-control {
      flex: 1;
      display: flex;
      margin-right: 20px;
      .el-button--text {
        font-size: 18px;
        padding: 10px 0;
        &:hover {
          color: #00c7ae;
        }
      }
      .slider {
        flex: 1;
      }
      .seconds {
        padding-left: 10px;
        line-height: 40px;
        width: 130px;
      }
    }
  }
  .list-wrapper {
    padding: 10px;
    height: calc(100% - 40px);
    box-sizing: border-box;
    overflow: auto;
  }

  .list-item {
    margin: 5px;
    display: inline-block;
    .config {
      height: 40px;
      line-height: 40px;
      display: flex;
      padding: 0 5px;
      .scene-name {
        flex: 1;
      }
    }

    .scene-wrapper {
      position: relative;
      overflow: hidden;
      border-radius: 5px;
      .hovers {
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 101;
        display: none;
      }
      &:hover {
        .hovers {
          display: initial;
        }
      }
      &:hover, &.current {
        cursor: pointer;
      }
      .element {
        position: absolute;
      }
    }
  }
}
</style>
