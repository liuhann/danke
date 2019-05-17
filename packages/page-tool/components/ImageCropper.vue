<template>
<div id="image-cropper" class="modal" :class="imageUrl? 'is-active': ''">
  <div class="modal-background"></div>
  <div class="modal-content" :style="fullSize">
    <div class="crop-container" :style="fullSize">
      <img id="crop-img" :src="imageUrl">
    </div>
    <div class="level-buttons">
      <div class="level is-mobile">
        <div class="level-left">
          <div class="buttons has-addons">
          <span class="button" v-for="ratio of imageRatios" :key="ratio"
                :class="currentRatio===ratio? 'is-primary ' + buttonSize: buttonSize"
                @click="setRatio(ratio)">{{ratio}}</span>
            <span class="button icon-up" :class="isRotate? 'is-primary' + buttonSize: buttonSize" @click="setRotate"></span>
            <span class="button icon-cw" :class="buttonSize" style="margin-left: .5rem;" @click="rotate(-5)"></span>
            <span class="button icon-ccw" :class="buttonSize" @click="rotate(5)"></span>
          </div>
        </div>
        <div class="level-right">
          <span class="button icon-ok is-success" :class="buttonSize" @click="cropComplete"></span>
        </div>
      </div>
    </div>
  </div>
  <button class="modal-close is-large" aria-label="close" @click="close"></button>
</div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import { imageRatios } from '../../danke-core/utils/css-options'
import Cropper from 'cropperjs'
import FormField from '../../common/components/FormField'
export default {
  name: 'ImageCropper',
  components: {FormField},
  data () {
    return {
      imageRatios,
      imageUrl: null,
      currentRatio: null,
      isRotate: false,
      client: {
        width: 0,
        height: 0
      }
    }
  },
  computed: {
    buttonSize () {
      if (this.client.width > 400) {
        return 'is-normal'
      } else {
        return 'is-small'
      }
    },
    fullSize () {
      return {
        width: this.client.width + 'px',
        height: this.client.height + 'px'
      }
    },

    cropContainerSize () {
      const size = {}
      if (this.client.width > this.client.height) {
        size.height = (this.client.height - 80) + 'px'
        size.width = (this.client.height - 80) * 1.5 + 'px'
      } else {
        size.width = size.width + 'px'
        size.height = size.width + 'px'
      }
      return size
    }
  },
  mounted () {
    this.client.width = window.innerWidth
    this.client.height = window.innerHeight
    this.open()
  },
  methods: {
    setRatio (ratio) {
      if (this.currentRatio === ratio) {
        this.currentRatio = null
        this.cropper.setAspectRatio(null)
      } else {
        this.currentRatio = ratio
        this.setRatioWithRotate()
      }
    },
    setRatioWithRotate () {
      const [x, y] = this.currentRatio.split(':')
      if (this.isRotate) {
        this.cropper.setAspectRatio(parseInt(y)/parseInt(x))
      } else {
        this.cropper.setAspectRatio(parseInt(x)/parseInt(y))
      }
    },
    setRotate () {
      this.isRotate = !this.isRotate
      if (this.currentRatio) {
        this.setRatioWithRotate()
      }
    },
    rotate (degree) {
      this.cropper.rotate(degree)
    },
    open (url) {
      const ic = this
      this.imageUrl = url
      const image = document.getElementById('crop-img');
      image.onload = function () {
        ic.cropper = new Cropper(image, {
          crop(event) {

          }
        })
      }
    },
    close () {
      this.cropper.destroy()
      this.imageUrl = null
    },
    cropComplete () {
      const ic = this
      const cropboxData = this.cropper.getCropBoxData()
      const pngBase64 = this.cropper.getCroppedCanvas().toBlob(blob => {
        this.cropCompleteCallback(blob, cropboxData)
        //this.$emit('complete', blob, cropboxData)
        this.close()
        ic.cropper.destroy()
      })
    }
  }
}
</script>

<style lang="scss">
#image-cropper {
  z-index: 10000;
  .modal-content {
    overflow: hidden;
    max-height: 100%;
  }
  .level-buttons {
    width: 100%;
    left: 0;
    position: absolute;
    bottom: 0;
    .level {
      max-width: 640px;
      margin: 0 auto;
    }
  }
}

#crop-img {
  max-width: 100%;
}
</style>
