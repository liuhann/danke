<template>
  <div id="scene-list">
    <div class="actions">
      <div v-if="!work.audioUrl">
        <el-upload
          class="upload-demo"
          action="https://danke.fun/posts/"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="audioFileChoosed"
        >
          <el-button size="mini" type="primary">
            上传并编辑背景音乐
          </el-button>
        </el-upload>
      </div>
      <div v-if="work.audioUrl" class="music-control">
        <el-button v-if="!audioPlaying" icon="el-icon-video-play" type="text" @click="audioPlay" />
        <el-button v-if="audioPlaying" icon="el-icon-video-pause" type="text" @click="audioPause" />
        <span class="current-seconds seconds"> {{ formatAudioSecond(audioCurrentSeconds) }}/ {{ formatAudioSecond(audioTotalSeconds) }} </span>
        <div class="slider">
          <el-slider ref="slider" v-model="audioCurrentSeconds" :marks="marks" :min="0" :max="audioTotalSeconds" @change="audioCurrentChange" />
        </div>
      </div>
      <div v-if="work.audioUrl" class="music-control">
        <el-button v-show="isNewAudio" icon="el-icon-back" type="text" @click="setClipStart" />
        <el-button v-show="isNewAudio" icon="el-icon-right" type="text" @click="setClipEnd" />
        <el-button v-show="isNewAudio" icon="el-icon-scissors" type="text" @click="cutAndUseAudio" />
        <el-button icon="el-icon-reading" type="text" @click="setSceneTurn" />
        <el-button icon="el-icon-delete" type="text" @click="removeAudio" />
      </div>
    </div>
    <draggable v-model="work.scenes" class="list-wrapper">
      <div v-for="(scene, index) in work.scenes" :key="scene._id" class="list-item" :class="(scene === current || scene.checked)? 'current': ''" :style="{
        width: viewPort.width + 'px',
        height: (viewPort.height + 40) + 'px'
      }"
      >
        <div :style="{
               background: work.color
             }"
             class="scene-wrapper"
             @click="chooseScene(scene)"
        >
          <render-scene :scene="scene" :view-box="work.viewBox" :view-port="viewPort" />
        </div>
        <div class="config">
          <span class="scene-name">{{ scene.name }}</span>
          <el-popover placement="top" title="场景">
            <el-button slot="reference" icon="el-icon-more" style="margin: 0 10px;" type="text" size="mini" />
            <div class="more-menu">
              <div class="menu-item" style="margin-bottom: 10px;">
                <el-input v-model="scene.name" style="width: 120px;" width="120" size="mini" />
                <el-button type="text" size="mini" @click="copyScene(index)">
                  复制
                </el-button>
                <el-button type="text" size="mini" @click="deleteScene(index)">
                  删除
                </el-button>
              </div>
              <div class="menu-item" style="margin-bottom: 10px;">
                <label style="margin-right: 10px;">持续时间</label>
                <el-input-number v-model="scene.duration" controls-position="right" size="mini" />  秒
              </div>
              <div class="menu-item" style="margin-bottom: 10px;">
                <label style="margin-right: 10px;">离开时间</label>
                <el-input-number v-model="scene.exit" controls-position="right" size="mini" />  秒
              </div>
              <div class="menu-item" style="margin-bottom: 10px;">
                <label style="margin-right: 10px;">离开动画</label>
                <el-checkbox v-model="scene.renderExit" />
              </div>
              <div class="menu-item" style="margin-bottom: 10px;">
                <label style="margin-right: 10px;">视角层次</label>
                <el-input-number v-model="scene.z" controls-position="right" size="mini" />
              </div>
            </div>
          </el-popover>
        </div>
      </div>
      <div class="add-new-item" :style="{
             width: viewPort.width + 'px',
             height: (viewPort.height + 40) + 'px'
           }"
           @click="addScene"
      >
        <span>增加场景</span>
      </div>
    </draggable>
  </div>
</template>

<script>
import toolbarPopMixin from './toolbar/toolbarPopMixin'
import draggable from 'vuedraggable'
import sceneMixins from './mixins/sceneMixins'
import workMixin from './work/workMixin'
import RenderScene from './render/RenderScene'
import { shortid } from '../utils/string'
import ImageDAO from '../utils/imagedao'
export default {
  name: 'SceneList',
  components: {
    RenderScene,
    draggable
  },
  mixins: [ sceneMixins, toolbarPopMixin, workMixin ],
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
      return {
        height: 160,
        width: 160 * this.work.viewBox.width / this.work.viewBox.height
      }
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

    fileExtension (fname) {
      return fname.slice((fname.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase()
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
      this.work.scenes.push(cloned)
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
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  background-color: rgba(255, 255, 255, .96);
  .actions {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    background: #fff;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0 2px;
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
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
  }

  .add-new-item {
    border: 1px solid #eee;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .list-item {
    margin: 5px;
    input[type="number"] {
      margin: 0 5px;
      border: 1px solid #eee;
      padding: 4px;
      width: 36px;
    }
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
      &:hover, &.current {
        cursor: pointer;
        opacity: .8;
      }
      .element {
        position: absolute;
      }
    }
  }
}
</style>
