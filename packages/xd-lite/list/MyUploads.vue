<template>
  <div class="lite-my-uploads" :style="listStyle">
    <div v-show="!croppingImage" class="image-list">
      <van-grid :border="false" :column-num="4" square>
        <van-grid-item>
          <van-uploader :after-read="fileRead" :before-read="beforeRead" class="photo-uploader" />
        </van-grid-item>
        <van-grid-item v-for="(img, index) in images" :key="index" @click="chooseImg(img, index)">
          <van-image lazy-load fit="cover" width="100%" height="100%" :src="getImageUrl(img.url, 100, 100, 'pad')" />
        </van-grid-item>
      </van-grid>
      <van-empty v-if="images.length === 0" description="无历史图片" />
    </div>

    <van-popup v-model="showCropPopover" :style="{height: '100%', width: '100%'}" position="bottom">
      <div v-show="croppingImage" ref="cropper" class="avatar-crop">
        <img id="crop-image" :src="croppingImage">
        <van-popover
          v-model="showPopover"
          class="crop-ratio"
          placement="top-start"
          trigger="click"
          :actions="clipOptions"
          @select="onRatioSelect"
        >
          <template #reference>
            <van-button type="primary">
              裁切比例
            </van-button>
          </template>
        </van-popover>
        <van-button class="cancel-button" @click="cancel">取 消</van-button>
        <van-button type="primary" class="confirm-button" @click="confirmCrop">确 定</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import RestDAO from '../../utils/restdao'
import ImageDAO from '../../utils/imagedao'
import { Toast } from 'vant'
import { getImageUrl } from '../../xd-builder/mixins/imageUtils'

export default {
  name: 'MyUploads',
  components: {  },
  props: {
    defaultRatio: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      showCropPopover: false,
      clipOptions: [{ text: '自由比例'}, { text: '1:1', ratio: 1 }, { text: '4:3', ratio: 1.333 }, { text: '3:4', ratio: 0.75 }, { text: '3:2', ratio: 1.5},  { text: '2:3', ratio: 0.667 }],
      ratio: '1:1',
      showPopover: false,
      images: [],
      deleteToggled: false,
      fetched: false,
      croppingImage: null
    }
  },
  computed: {
    listStyle () {
      if (this.croppingImage) {
        return {
          height: '100vh'
        }
      } else {
        return {}
      }
    },
    photoStyle () {
      return {
        width: this.gridWidth + 'px',
        height: this.gridWidth + 'px'
      }
    }
  },
  created () {
    this.restdao = new RestDAO(this.ctx, `danke/image`)
    this.imagedao = new ImageDAO(this.ctx)
  },
  mounted () {
    this.gridWidth = window.screen.availWidth / 4
    this.loadMyImages()
  },
  methods: {
    getImageUrl,
    cancel () {
      this.showCropPopover = false
      this.croppingImage = null
    },

    confirmCrop () {
      Toast.loading('正在裁切并保存图片')
      const canvas = this.cropper.getCroppedCanvas({
        maxWidth: 1080,
        maxHeight: 2400
      })
      const imageObject = {
        name: '',
        width: canvas.width,
        height: canvas.height,
      }
      canvas.toBlob( async blob => {
        this.croppingImage = null
        imageObject.size = blob.size
        let result = await this.imagedao.uploadBlob(blob, `images`)
        imageObject.url = result.name
        // write file info
        await this.restdao.create(imageObject)
        this.fetched = false
        await this.loadMyImages()
        this.showCropPopover = false
        Toast.clear(true)
      }, 'image/jpeg')
    },
    open () {
      this.show = true
    },
    opened () {
      this.loadMyImages()
    },
    async loadMyImages () {
      if (!this.fetched) {
        this.images = (await this.restdao.list({
          page: 1,
          count: 100
        })).list
      }
    },

    // 选择图片回调
    async chooseImg (img, index) {
      // 切换后允许点击、删除
      if (this.deleteToggled) {
        this.restdao.delete(img)
        this.images.splice(index, 1)
      } else {
        // 发出select事件
        this.$emit('select', img)
      }
    },

    beforeRead () {
      Toast.loading('正在读取文件')
      return true
    },
    fileRead (file) {
      this.croppingImage = file.content
      this.showCropPopover = true
      this.$nextTick(() => {
        const image = document.getElementById('crop-image');
        if (this.cropper) {
          this.cropper.destroy()
        }
        this.cropper = new Cropper(image, {
          aspectRatio: this.defaultRatio,
          background: false,
          dragMode: 'move',
          crop(event) {},
        });
        Toast.clear(true)
      })
      // const resize = new Croppie(this.$refs.cropper, {
      //   viewport: { width: 300, height: 300 },
      //   showZoomer: false,
      //   enableResize: true,
      //   enforceBoundary: true,
      //   enableOrientation: false
      // });
      // resize.bind({
      //   url: file.content
      // });
    },
    onRatioSelect (action) {
      if (action.ratio) {
        this.cropper.setAspectRatio(action.ratio)
      } else {
        this.cropper.setAspectRatio(NaN)
      }
    }
  }
}
</script>

<style lang="scss">
.lite-my-uploads {
  .van-grid-item__content {
    padding: 2px;
  }
  .van-uploader {
    width: 100%;
    height: 100%;
    .van-uploader__wrapper {
      width: 100%;
      height: 100%;
      .van-uploader__upload {
        width: 100%;
        height: 100%;
        margin: 0;
      }
    }
  }
}
.avatar-crop {
  background: #7c7c7c;
  overflow: hidden;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  .crop-ratio {
    position: absolute;
    left: 10px;
    bottom: 10px;
  }
  .confirm-button {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
  .cancel-button {
    position: absolute;
    right: 100px;
    bottom: 10px;
  }
}
</style>
