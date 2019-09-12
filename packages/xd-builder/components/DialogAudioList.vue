<template>
<el-dialog
  title="选择音频"
 :visible.sync="dialogVisible">
  <tabs :tabs="tabs" size="is-small" v-model="currentTab"></tabs>
  <div class="new-audio">
    <a class="file">
      <label class="file-label">
        <input class="file-input" type="file" name="resume" @input="audioChoosed">
        <a class="button is-small">上传音频</a>
      </label>
    </a>
    <div class="progress-container" v-if="audioUrl">
      <progress v-if="audioUrl" class="progress is-success" :value="autioPercent" max="100">{{autioPercent}}%</progress>
    </div>
    <div class="field has-addons" v-if="audioUrl">
      <div class="control field-lb">
        名称
      </div>
      <div class="control">
        <input class="input is-small" style="width: 280px;" v-model="audioName">
      </div>
    </div>
    <div class="ticks-info" v-if="audioUrl">
      <input class="input is-small" type="number" style="width: 80px;" v-model.number="audioCurrentSeconds" @change="changeAudioCurrentSeconds"> / {{Math.floor(this.audioTotalSeconds)}} 秒
      <ul>
        <li>开始秒数{{audioStartPoint}}</li>
        <li>节拍点{{audioTicks.join(',')}}</li>
        <li>结束秒数{{audioEndPoint}}</li>
        <li>音频长度{{audioEndPoint}}</li>
      </ul>
    </div>
    <div class="audio-actions">
      <span class="button is-white" @click="pause">暂停</span>
      <span class="button is-white" @click="play">播放</span>
      <span class="button is-primary" @click="setStartPoint">设为开始点</span>
      <span class="button is-white" @click="setTickPoint">节拍</span>
      <span class="button is-white" @click="audioTicks = []">清空节拍</span>
      <span class="button is-primary" @click="setEndPoint">设为结束点</span>
    </div>
  </div>

  <span slot="footer" class="dialog-footer">
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
      audioStartPoint: 0,
      audioEndPoint: 0,
      audioTicks: [],
      audioTotalSeconds: 0,
      audioCurrentSeconds: 0,
      audios: []
    }
  },
  created () {
    this.uploaddao = new ImageDAO(this.ctx)
    this.audiodao = new RestDAO(this.ctx, 'danke/audio')
  },
  watch: {
    'dialogVisible': function () {
      if (!this.dialogVisible) {
        if (this.sound) {
          this.sound.unload()
        }
        if (this.inteval) {
          clearInterval(this.inteval)
        }
      }
    }
  },
  beforeDestroy () {
    
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
    clearSound () {
      if (this.sound) {
        this.sound.unload()
      }
      if (this.inteval) {
        clearInterval(this.inteval)
      }
      this.audioUrl = ''
      this.audioStartPoint = 0
      this.audioEndPoint = 0
      this.audioTicks = []
      this.audioTotalSeconds = 0
      this.audioCurrentSeconds = 0

    },
    changeAudioCurrentSeconds () {
      this.sound.seek(this.audioCurrentSeconds)
    },
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
        this.audioFile = file
        this.audioUrl = URL.createObjectURL(file)
        this.audioName = file.name
        this.sound = new Howl({
          src: this.audioUrl,
          html5: true,
          format: ['mp3']
        })
        this.sound.on('load', () => {
          this.audioTotalSeconds = this.sound.duration()
          this.audioEndPoint = this.audioTotalSeconds
        })
        this.startTick()
        this.sound.play()
        // const uploaded = await this.uploaddao.uploadBlob(file, 'audios')
        // const audio = {
        //   url: uploaded.name
        // }
      }
    },
    setStartPoint () {
      this.audioStartPoint = this.audioCurrentSeconds
    },
    setEndPoint () {
      this.audioEndPoint = this.audioCurrentSeconds
    },
    setTickPoint () {
      this.audioTicks.push(this.audioCurrentSeconds)
    },
    async confirm () {
      if (this.audioUrl) {
        const result = await this.uploaddao.uploadAndCutMp3(this.audioFile, this.audioName, this.audioStartPoint, this.audioEndPoint)

        const audioCuttie = {
          name: this.audioName,
          ticks: this.audioTicks.map(value => value - this.audioStartPoint),
          audioUrl: result.name
        }
        const audioResult = await this.audiodao.create(audioCuttie)
        this.$emit('audio', audioResult)
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.new-audio {
  padding: 10px;
  .progress-container {
    padding: 10px 0;
  }
}

</style>
