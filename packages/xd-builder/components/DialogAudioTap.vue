<template>
<el-dialog
  title="编辑音频节拍"
  :fullscreen="true"
 :visible.sync="dialogVisible">
  <div class="new-audio">
    <div v-if="!audioUrl" class="file is-success" style="margin-bottom: 10px;">
      <label class="file-label">
        <input class="file-input" type="file" @input="audioChoosed">
        <span class="file-cta">
          <span class="file-label">上传音频</span>
        </span>
      </label>
    </div>
    <div class="audio-box" v-if="audioUrl" ref="audioBox" style="margin-bottom: 10px;" @click="boxClicked">
      <div class="cut-box" :style="'left:' + (100 * audioStartPoint / audioTotalSeconds) + '%;'
      + 'right:' + (100 * (audioTotalSeconds - audioEndPoint) / audioTotalSeconds) + '%'"/>
      <div class="start ver-line" :style="'left:' + (100 * audioStartPoint / audioTotalSeconds) + '%'"></div>
      <div class="start dura"  :style="'left:' + (100 * audioStartPoint / audioTotalSeconds) + '%'"></div>

      <div class="end ver-line" :style="'left:' + (100 * audioEndPoint / audioTotalSeconds) + '%'"></div>
      <div class="end dura"  :style="'left:' + (100 * audioEndPoint / audioTotalSeconds) + '%'"></div>
      <div class="current ver-line" :style="'left:' + (100 * audioCurrentSeconds / audioTotalSeconds) + '%'"></div>
      <div class="current dura"  :style="'left:' + (100 * audioCurrentSeconds / audioTotalSeconds) + '%'">{{timeFormat(audioCurrentSeconds)}}</div>
      <div class="tick" v-for="tick in audioTicks" :key="tick"
        :style="'left:' + (100 * tick / audioTotalSeconds) + '%'" />
    </div>
    <div class="tags has-addons" v-if="audioUrl">
      <span class="tag is-dark is-small" @click="setStartPoint">设置开始时间</span>
      <span class="tag is-success is-small">{{timeFormat(audioStartPoint)}}</span>
    </div>
    <div class="tags has-addons" v-if="audioUrl">
      <span class="tag is-dark is-small" @click="setEndPoint">设为结束时间</span>
      <span class="tag is-success is-small">{{timeFormat(audioEndPoint)}}</span>
    </div>
    <div class="buttons has-addons" v-if="audioUrl">
      <span class="button is-info is-small" v-if="isPlaying" @click="pause">暂停</span>
      <span class="button s-info is-small" v-if="!isPlaying" @click="play">播放</span>
    </div>
  </div>
  <span slot="footer" class="dialog-footer">
    <a class="button is-primary is-small" @click="confirm">
        确 定
    </a>
  </span>
</el-dialog>
</template>

<script>
import { Dialog, Loading } from 'element-ui'
import ImageDAO from '../../common/dao/imagedao'
import RestDAO from '../../common/dao/restdao'
import { Howl } from 'howler'
export default {
  name: 'DialogAudioTap',
  props: {
    fullscreen: {
      type: Boolean,
      default: false
    },
    setName: {
      type: Boolean,
      default: true
    },
    audioPath: {
      type: String,
      default: ''
    }
  },
  components: {
    [Dialog.name]: Dialog
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
      audioCurrentSeconds: 0
    }
  },
  created () {
    this.uploaddao = new ImageDAO(this.ctx)
    this.audiodao = new RestDAO(this.ctx, 'danke/oaudio')
  },
  watch: {
    'dialogVisible': function () {
      if (!this.dialogVisible) {
        this.clearSound()
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
  filters: {
  },
  methods: {
    timeFormat: function (t) {
      try {
        const i = parseInt(t)
        const subs = Math.floor((t * 10) % 10)
        if (isNaN(i)) {
          return '0:00'
        } else {
          return Math.floor(i / 60) + ':' + ((i % 60 < 10) ? `0${i % 60}` : (i % 60)) + '.' + subs
        }
      } catch (e) {
        return '未知'
      }
    },
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
    boxClicked (e) {
      const percent = (e.pageX - e.currentTarget.offsetLeft) / e.currentTarget.clientWidth
      this.audioCurrentSeconds = percent * this.audioTotalSeconds
      this.sound.seek(this.audioCurrentSeconds)
    },
    changeAudioCurrentSeconds () {
      this.sound.seek(this.audioCurrentSeconds)
    },
    open () {
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
      }, 300)
    },
    pause () {
      this.sound.pause()
    },
    play () {
      this.sound.play()
    },

    async openWithAudioFile (file) {
      this.dialogVisible = true
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
      }
    },
    setStartPoint () {
      this.audioStartPoint = this.audioCurrentSeconds
    },
    setEndPoint () {
      this.audioEndPoint = this.audioCurrentSeconds
      this.pause()
    },
    setTickPoint () {
      this.audioTicks.push(this.sound.seek())
    },
    async confirm () {
      if (this.audioUrl) {
        const loading = Loading.service({
          lock: true,
          text: '上传音频文件并剪切中',
          fullscreen: true,
          background: 'rgba(255, 255, 255, 0.6)'
        })
        const result = await this.uploaddao.uploadAndCutMp3(this.audioFile, this.audioPath + '/' + this.audioName, this.audioStartPoint, this.audioEndPoint)
        const audioCuttie = {
          name: this.audioName,
          ticks: this.audioTicks.map(value => value - this.audioStartPoint),
          audioUrl: result.name,
          dura: Math.floor(this.audioEndPoint - this.audioStartPoint)
        }
        // await this.audiodao.create(audioCuttie)
        loading.close()
        this.$emit('audio', audioCuttie)
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.new-audio {
  padding: 10px;
}

.audio-box {
  position: relative;
  height: 80px;
  background-color: #efefef;

  .cut-box {
    background: #32fd252e;
    position: absolute;
    top: 0;
    bottom: 0;
  }

  .dura {
    position: absolute;
    bottom: 0;
    font-size: 9px;
    padding-left: 5px;
    &.end {
      margin-left: -30px;
    }
    &.current {
      top: 0;
    }
  }

  .tick {
    position: absolute;
    bottom: 0;
    top: 0;
    width: 3px;
    background-color: #20c8eeb3;
    margin-left: -1px;
  }

  .ver-line {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 1px;
    background-color: #999;
    &.current {
      background-color: #3ec805;
    }
  }
}

</style>
