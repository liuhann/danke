<template>
<div id="image-cropper" class="modal" :class="imageUrl? 'is-active': ''">
  <div class="modal-background"></div>
  <div class="modal-content" :style="fullSizeStyle">
    <div class="crop-container" :style="fullSizeStyle">
      <img ref="crop" :src="imageUrl">
    </div>
    <div class="cropped-boxes">
      <div v-for="(crop, index) in croppedData" :key="index" :style="{
        left: crop.cropbox.left + 'px',
        top: crop.cropbox.top + 'px',
        width: crop.cropbox.width + 'px',
        height: crop.cropbox.height + 'px'
      }">
      </div>
    </div>
  </div>
  <div class="level-buttons">
    <div class="container is-centered">
      <nav class="level is-mobile">
        <!-- Left side -->
        <div class="buttons has-addons">
            <span class="button is-small" v-for="ratio of imageRatios" :key="ratio"
                  :class="currentRatio===ratio? 'is-primary ': ''"
                  @click="setRatio(ratio)">{{ratio}}</span>
          <span class="button is-small icon-cw" :class="isRotate?'is-primary':''" @click="setRotate">旋转</span>
          <span class="button is-small icon-plus" @click="cropAdd()">裁切</span>
          <span class="button is-small icon-ok is-success" @click="cropComplete">完成</span>
          <span class="button is-small icon-ok is-success" @click="fullCrop">原图</span>
        </div>
      </nav>
    </div>
  </div>
  <div class="crop-info">
    <p>x: {{cropInfo.x}}</p>
    <p>y: {{cropInfo.y}}</p>
    <p>w: {{cropInfo.w}}</p>
    <p>h: {{cropInfo.h}}</p>
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
  components: { FormField },
  props: {
  },
  data () {
    return {
      ratio: '4:3',
      imageRatios,
      imageUrl: null,
      currentRatio: null,
      isRotate: false,
      cropInfo: {
        x: 0,
        y: 0,
        w: 0,
        h: 0
      },
      client: {
        width: 1,
        height: 1
      },
      croppedData: []
    }
  },
  computed: {
    fullSize () {
      const builderRatio = this.client.width / this.client.height
      let [w, h] = this.ratio.split(':')
      const sceneRatio = parseInt(w) / parseInt(h)

      if (builderRatio > sceneRatio) {
        return {
          height: this.client.height,
          width: this.client.height * sceneRatio
        }
      } else {
        return {
          height: this.client.width / sceneRatio,
          width: this.client.width
        }
      }
    },

    fullSizeStyle () {
      return {
        width: this.fullSize.width + 'px',
        height: this.fullSize.height + 'px'
      }
    }
  },
  mounted () {
    this.client.width = window.innerWidth
    this.client.height = window.innerHeight
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
        this.cropper.setAspectRatio(parseInt(y) / parseInt(x))
      } else {
        this.cropper.setAspectRatio(parseInt(x) / parseInt(y))
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
    open (blob, ratio) {
      const ic = this
      this.blob = blob
      this.ratio = ratio
      this.imageUrl = URL.createObjectURL(blob)
      this.croppedData = []
      const image = this.$refs.crop
      image.onload = function () {
        ic.cropper = new Cropper(image, {
          crop (event) {
            const cropboxData = ic.cropper.getCropBoxData()
            ic.cropInfo.x = Math.floor(cropboxData.left)
            ic.cropInfo.y = Math.floor(cropboxData.top)
            ic.cropInfo.w = Math.floor(cropboxData.width)
            ic.cropInfo.h = Math.floor(cropboxData.height)
          }
        })
      }
    },
    close () {
      this.cropper.destroy()
      this.imageUrl = null
    },
    cropAdd (addComplete) {
      const cropboxData = this.cropper.getCropBoxData()
      this.cropper.getCroppedCanvas({
        width: cropboxData.width,
        height: cropboxData.height
      }).toBlob((blob) => {
        this.croppedData.push({
          blob,
          cropbox: cropboxData
        })
        addComplete && addComplete()
      })
    },
    fullCrop () {
      const imageData = this.cropper.getImageData()
      this.croppedData.push({
        blob: this.blob,
        cropbox: {
          width: imageData.naturalWidth,
          height: imageData.naturalHeight
        }
      })
      this.cropCompleteCallback(this.croppedData, this.fullSize)
      this.close()
    },
    cropComplete () {
      if (this.croppedData.length) {
        this.cropCompleteCallback(this.croppedData, this.fullSize)
        this.close()
      } else {
        this.cropAdd(() => {
          this.cropCompleteCallback(this.croppedData, this.fullSize)
          this.close()
        })
      }
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
    position: absolute;
    bottom: 0;
    margin: 0 auto;
  }
  .crop-info {
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0, .6);
    color: #fff;
    font-size: 10px;
    padding: 0 5px;
  }
  .cropped-boxes {
    >div {
      position: absolute;
      border: 1px solid #fff;
    }
  }
}

#crop-img {
  max-width: 100%;
}
</style>
