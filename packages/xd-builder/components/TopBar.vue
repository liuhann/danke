<template>
<div class="top-bar is-clearfix">
  <div class="tools-bar flex-1">
    <div>
      <a class="file">
        <label class="file-label">
          <input class="file-input" type="file" name="resume" @input="imageFileChoosed">
          <span class="button is-white icon-picture-1">
          </span>
        </label>
      </a>
    </div>
    <a class="button is-white icon-doc-landscape" @click="insertShape('rect')"></a>
    <a class="button is-white icon-circle-thin" @click="insertShape('circle')"></a>
    <a class="button is-white icon-sort-alphabet" @click="insertText"></a>
    <div>
      <a class="file">
        <label class="file-label">
          <input class="file-input" type="file" name="crop" @input="fileChoosed">
          <span class="button icon-crop is-white"></span>
        </label>
      </a>
    </div>
  </div>
  <div class="right-buttons">
<!--    <a class="button is-white is-small" @click="zoomIn">-->
<!--      <i class="icon-minus-1"></i>-->
<!--    </a>-->
<!--    <span style="line-height: 38px;">{{Math.round($parent.zoom * 100)}}%</span>-->
<!--    <a class="button is-white is-small" @click="zoomOut">-->
<!--      <i class="icon-plus-1"></i>-->
<!--    </a>-->
    <a class="button is-small" @click="runWork">
      预览
    </a>
<!--    <a class="button is-success is-rounded is-small button-share" @click="publishShareWork">发布</a>-->
  </div>
</div>
</template>
<script>
import { Message } from 'element-ui'
export default {
  name: 'TopBar',
  props: { },
  components: { },
  data () {
    return {
      isEditName: false
    }
  },
  methods: {
    imageFileChoosed (e) {
      if (e.currentTarget.files.length) {
        const file = e.currentTarget.files[0]
        if (file.size > this.ctx.upload.maxSize) {
          Message.error('文件最大为' + Math.floor(this.ctx.upload.maxSize / (1024 * 1024)) + 'M')
          return
        }
        const image = new Image()
        image.onload = () => {
          this.$emit('insert-image', file)
          // builder.insertRawImage(file, this.width, this.height)
        }
        image.src = URL.createObjectURL(file)
      }
    },

    fileChoosed (e) {
      if (e.currentTarget.files.length) {
        const file = e.currentTarget.files[0]
        if (file.size > this.ctx.upload.maxSize) {
          this.error = '文件最大为' + this.ctx.upload.maxSize
        }
        this.$emit('crop', file)
        this.croppingFileName = file.name
        this.$refs.cropper.open(file, this.ratio || '16:9')
        this.$refs.cropper.cropCompleteCallback = this.insertImage
        e.currentTarget.value = ''
      }
    },
    insertShape (type) {
      this.$emit('insert-shape', type)
    },

    insertText () {
      this.$emit('insert-text')
    },
    runWork () {
      this.$emit('run')
    }
  }
}
</script>
<style lang="scss">
#xd {
  .top-bar {
    height: 38px;
    display: flex;
    background-color: #fff;
    .align-right {
      text-align: right;
    }
    .right-buttons {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .flex-1 {
      flex: 1;
    }
    .tools-bar {
      display: flex;
    }
    .button-share {
      margin: .25em 1em;
    }
  }
}
</style>
