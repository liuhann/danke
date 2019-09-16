<template>
<el-dialog
  title="选择音频"
 :visible.sync="dialogVisible">
  <div class="new-audio">
    <div class="file is-success" style="margin-bottom: 10px;">
      <label class="file-label">
        <input class="file-input" type="file" name="chooseaudio" @input="audioChoosed">
        <span class="file-cta">
          <span class="file-label">上传音频</span>
        </span>
      </label>
    </div>
    
    <div class="field has-addons" v-if="audioUrl" style="margin-bottom: 10px;">
      <div class="control field-lb">
        名称
      </div>
      <div class="control">
        <input class="input is-small" style="width: 280px;" v-model="audioName">
      </div>
    </div>

    <div class="audio-box" v-if="audioUrl" style="margin-bottom: 10px;" @click="boxClicked">
      <div class="cut-box" :style="'left:' + (100 * audioStartPoint / audioTotalSeconds) + '%;'
      + 'right:' + (100 * (audioTotalSeconds - audioEndPoint) / audioTotalSeconds) + '%'"/>
      <div class="start ver-line" :style="'left:' + (100 * audioStartPoint / audioTotalSeconds) + '%'"></div>
      <div class="start dura"  :style="'left:' + (100 * audioStartPoint / audioTotalSeconds) + '%'">{{timeFormat(audioStartPoint)}}</div>

      <div class="end ver-line" :style="'left:' + (100 * audioEndPoint / audioTotalSeconds) + '%'"></div>
      <div class="end dura"  :style="'left:' + (100 * audioEndPoint / audioTotalSeconds) + '%'">{{timeFormat(audioEndPoint)}}</div>

      <div class="current ver-line" :style="'left:' + (100 * audioCurrentSeconds / audioTotalSeconds) + '%'"></div>
      <div class="current dura"  :style="'left:' + (100 * audioCurrentSeconds / audioTotalSeconds) + '%'">{{timeFormat(audioCurrentSeconds)}}</div>
      
      <div class="tick" v-for="tick in audioTicks" :key="tick"
        :style="'left:' + (100 * tick / audioTotalSeconds) + '%'" />
    </div>
    <div class="audio-actions buttons has-addons is-small" v-if="audioUrl">
      <span class="button is-small is-primary" @click="setTickPoint">节拍</span>
      <span class="button is-small" @click="setStartPoint">设为开始点</span>
      <span class="button is-small" @click="audioTicks = []">清空节拍</span>
      <span class="button is-small" @click="setEndPoint">设为结束点</span>
      <span class="button is-info is-small" v-if="isPlaying" @click="pause">暂停</span>
      <span class="button s-info is-small" v-if="!isPlaying" @click="play">播放</span>
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
import { Howl, Howler } from 'howler'
export default {
  name: 'DialogAudioTap',
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
      const percent = e.offsetX / e.srcElement.clientWidth
      this.audioCurrentSeconds = percent * this.audioTotalSeconds
      this.sound.seek(this.audioCurrentSeconds)
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
      }, 300)
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
      this.audioTicks.push(this.audioCurrentSeconds)
    },
    async confirm () {
      if (this.audioUrl) {
        const result = await this.uploaddao.uploadAndCutMp3(this.audioFile, this.audioName, this.audioStartPoint, this.audioEndPoint)

        const audioCuttie = {
          name: this.audioName,
          ticks: this.audioTicks.map(value => value - this.audioStartPoint),
          audioUrl: result.name,
          dura: this.audioStartPoint - this.audioEndPoint
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
