<template>
  <form-field label="图片">
    <figure class="img-choose-upload is-3by2" :style="imageStyle">
    </figure>
    <div class="field">
      <div class="file is-small">
        <label class="file-label">
          <input class="file-input" type="file" name="resume" @input="fileChoosed">
          <span class="file-cta button">
            <span class="file-icon">
              <i class="icon-upload-cloud"></i>
            </span>
            <span class="file-label">
              选择文件
            </span>
          </span>
        </label>
        <span v-if="src" class="button icon-cancel is-small" @click="removeSrc"></span>
      </div>
    </div>
  </form-field>
</template>

<script>
import FormField from '../../common/FormField'
export default {
  name: 'ImageUpload',
  components: {FormField},
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      src: this.value
    }
  },

  watch: {
    'value': function () {
      this.src = this.value
    }
  },
  computed: {
    imageStyle () {
      if (this.src) {
        return {
          backgroundImage: `url('${this.src}')`
        }
      } else {
        return {}
      }
    }
  },
  methods: {
    fileChoosed (e) {
      if (e.currentTarget.files.length) {
        const file = e.currentTarget.files[0]
        if (file.size > this.ctx.upload.maxSize) {
          this.error = '文件最大为' + this.ctx.upload.maxSize
        }
        this.src = URL.createObjectURL(file)
        this.ctx.fileUrls = this.ctx.fileUrls || {}
        this.ctx.fileUrls[this.src] = file
        this.$emit('input', this.src)
      }
    },
    removeSrc () {
      this.src = ''
      this.$emit('input', '')
    }
  }
}
</script>

<style>
.img-choose-upload {
  width: 180px;
  height: 120px;
  margin-bottom: 5px;
  position: relative;
  background-position: center;
  background-color: rgba(0,0,0, .5);
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
