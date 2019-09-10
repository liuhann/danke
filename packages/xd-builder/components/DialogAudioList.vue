<template>
<el-dialog
  title="选择音频"
 :visible.sync="dialogVisible">
  <tabs :tabs="tabs" v-model="currentTab"></tabs>
  <div class="new-audio">
    <a class="file">
      <label class="file-label">
        <input class="file-input" type="file" name="resume" @input="audioChoosed">
        <span class="button is-white">上传音频</span>
      </label>
    </a>
    <div class="progress-container" v-if="audioUrl">
      <progress v-if="audioUrl" class="progress is-success" :value="autioPercent" max="100">{{autioPercent}}%</progress>
    </div>
    <div class="ticks-info">

    </div>

    <div class="field has-addons">
      <div class="control field-lb">
        名称
      </div>
      <div class="control">
        <input v-model="audioName"></input>
      </div>
    </div>

    <div v-if="audioUrl">
      <span class="button is-white" @click="pause">暂停</span>
      <span class="button is-white" @click="play">播放</span>
    </div>
  </div>

  <div class="columns is-mobile is-multiline">
  </div>
  <span slot="footer" class="dialog-footer">
    <a class="button is-small" @click="dialogVisible = false">
        取 消
    </a>
    <a class="button is-small is-primary" @click="confirm">
        确 定
    </a>
  </span>
</el-dialog>
</template>

<script>
import ImageDAO from '../../common/dao/imagedao'
import RestDAO from '../../common/dao/restdao'
import Tabs from '../../common/components/Tabs.vue'
import {Howl, Howler} from 'howler'
export default {
  name: 'DialogAudioList',
  components: {
    Tabs
  },
  data () {
    return {
      tabs: [{
        key: 'upload',
        title: '上传'
      }, {
        key: 'list',
        title: '选择'
      }],
      audioName: '',
      currentTab: 'list',
      dialogVisible: false,
      audioUrl: '',
      isPlaying: false,
      audioTotalSeconds: 0,
      audioCurrentSeconds: 0,
      audios: []
    }
  },
  created () {
    this.uploaddao = new ImageDAO(this.ctx)
    this.audiodao = new RestDAO(this.ctx, 'danke/audio')
  },
  computed: {
    autioPercent () {
      if (this.audioTotalSeconds) {
        return Math.floor(this.audioCurrentSeconds / this.audioTotalSeconds * 100)
      } else {
        return 0
      }
    }
  },
  methods: {
    open (work) {
      this.audios = work.audios
      this.dialogVisible = true
    },
    startTick () {
      const _this = this
      if (this.inteval) {
        clearInterval(this.inteval)
      }
      this.inteval = setInterval(() => {
        if (_this.sound) {
          _this.isPlaying = _this.sound.playing()
          _this.audioCurrentSeconds = _this.sound.seek()
        }
      }, 500)
    },

    pause () {
      this.sound.pause()
    },
    play () {
      this.sound.play()
    },
    async audioChoosed (e) {
      if (e.currentTarget.files.length) {
        if (this.sound) {
          this.sound.unload()
        }
        const file = e.currentTarget.files[0]
        this.audioUrl = URL.createObjectURL(file)
        this.audioName = file.name
        this.sound = new Howl({
          src: this.audioUrl,
          html5: true,
          format: ['mp3']
        })
        this.sound.on('load', () => {
          this.audioTotalSeconds = this.sound.duration()
        })
        this.startTick()
        this.sound.play()
        // const uploaded = await this.uploaddao.uploadBlob(file, 'audios')
        // const audio = {
        //   url: uploaded.name
        // }
      }
    },
    confirm () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>

</style>
