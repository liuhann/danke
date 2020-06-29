<template>
  <a-form-model class="tick-form">
    <a-form-model-item v-if="!audio._id">
      <a-upload
        class="upload-demo"
        :show-file-list="false"
        :before-upload="audioFileChoosed"
      >
        <a-button type="primary">
          上传并编辑音乐
        </a-button>
      </a-upload>
    </a-form-model-item>
    <a-form-model-item>
      <a-input v-model="audio.name" />
    </a-form-model-item>
    <a-form-model-item v-if="audio.url" class="music-control">
      <a-button v-if="!audioPlaying" size="small" @click="audioPlay">
        播放
      </a-button>
      <a-button v-if="audioPlaying" @click="audioPause">
        暂停
      </a-button>
      <span class="current-seconds seconds"> {{ formatAudioSecond(audioCurrentSeconds) }}/ {{ formatAudioSecond(audio.dura) }} </span>
      <div class="slider">
        <a-slider ref="slider" v-model="audioCurrentSeconds" :marks="radioMarks" :min="0" :max="audio.dura" :step="0.1" @change="audioCurrentChange" />
      </div>
    </a-form-model-item>
    <a-form-model-item>
      <el-button v-if="!audio._id" @click="setClipStart">
        起始点{{ formatAudioSecond(cutStart) }}
      </el-button>
      <el-button v-if="!audio._id" @click="setClipEnd">
        结束点{{ formatAudioSecond(cutEnd) }}
      </el-button>
      <el-button @click="setTick">
        打点
      </el-button>
      <el-button @click="clearTick">
        清除打点
      </el-button>
    </a-form-model-item>
    <a-form-model-item>
      <el-button @click="saveAudio">
        保存
      </el-button>
      <el-button v-if="audio._id" type="danger" @click="removeAudio">删除</el-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import ImageDAO from '../utils/imagedao'
import RestDAO from '../utils/restdao.js'
import antVueMixin from '../utils/ant-vue-mixins'
import { shortid, fileExtension } from '../utils/string'
import { Form, FormItem, Upload, Slider, Button } from 'element-ui'
export default {
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Slider.name]: Slider,
    [Button.name]: Button,
    [Upload.name]: Upload
  },
  mixins: [antVueMixin],
  data () {
    return {
      audio: {
        dura: 0,
        url: null,
        ticks: [],
        name: ''
      },
      fileName: '',
      cutStart: 0,
      cutEnd: 0,
      audioStartPoint: 0,
      audioEndPoint: 0,
      audioDragging: false,
      audioPlaying: false,
      audioCurrentSeconds: 0,
    }
  },
  computed: {
    radioMarks () {
      const marks = {}
      for (let tick of this.audio.ticks) {
        marks[tick] = ''
      }
      marks[this.cutStart] = '起始点'
      marks[this.cutEnd] = '结束点'
      return marks
    }
  },

  mounted () {
    if (this.$route.query.id) {
      this.fetchAudioObject(this.$route.query.id)
    }
  },
  created () {
    this.mediadao = new ImageDAO(this.ctx)
    this.audiodao = new RestDAO(this.ctx, 'danke/audio')
  },
  methods: {
    async fetchAudioObject (id) {
      const result = await this.audiodao.getOne(id)
      this.audio = result
      this.loadAudio(this.audio.url)
    },

    audioFileChoosed (file) {
      this.audioFile = file
      this.audio.url = URL.createObjectURL(this.audioFile)
      this.audio.name = this.audioFile.name
      this.fileName = this.audioFile.name
      this.loadAudio(this.audio.url)
      return false
    },

    loadAudio (url) {
      this.audioInstance = new Audio(url)
      this.audioInstance.onloadedmetadata = () => {
        this.audio.dura = this.audioInstance.duration
        this.audioEndPoint = this.audioInstance.duration
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
    audioPlay () {
      this.audioInstance.play()
      this.audioPlaying = true
    },

    audioPause () {
      if (this.audioInstance) {
        this.audioInstance.pause()
      }
      this.audioPlaying = false
    },

    formatAudioSecond (second) {
      return new Date(second * 1000).toISOString().replace(/.*(\d{2}:\d{2}.\d{2}).*/, "$1");
    },

    audioCurrentChange (time) {
      this.audioInstance.currentTime = time
      this.audioCurrentSeconds = time
    },

    setClipStart () {
      this.cutStart = this.audioCurrentSeconds
    },
    setClipEnd () {
      this.cutEnd = this.audioCurrentSeconds
    },

    setTick () {
      this.audio.ticks.push(this.audioCurrentSeconds)
    },

    clearTick () {
      this.audio.ticks = []
    },

    async removeAudio () {
      await this.audiodao.delete(this.audio)
      await this.mediadao.removeBlob(new URL(this.audio.url).pathname)

    },
    async saveAudio () {
      
      this.audioPause()
      if (!this.audio._id) {
        if (this.cutEnd <= this.cutStart) {
          this.$message.error('开始时间 > 结束时间')
          return
        }
        const result = await this.mediadao.uploadAndCutMp3(this.audioFile, '15011245191/audios/' + shortid(10) + '.mp3', this.cutStart, this.cutEnd)
        this.audio.url = result.url
        this.audio.dura = this.cutEnd - this.cutStart
        this.loadAudio(this.audio.url)
      }
      await this.audiodao.createOrPatch(this.audio)
      this.$message.success('已保存打点信息')
    }
  }
}
</script>

<style lang="scss">
.tick-form {
  margin: 20px auto;
  width: 80%;
}

</style>