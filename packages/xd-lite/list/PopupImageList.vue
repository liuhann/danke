<template>
  <van-popup
    v-model="show"
    class="image-list"
    :style="{ height: '100%' }"
    position="bottom"
  >
    <van-nav-bar v-if="!image">
      <template #right>
        <van-icon name="close" size="20" @click="show=false" />
      </template>
    </van-nav-bar>
    <div v-if="!image">
      <van-uploader :after-read="fileRead" />

      <van-empty v-if="images.length === 0" description="无历史图片" />
      <div class="image-list">
        <van-image
          v-for="img in images"
          :key="img.url"
          width="100"
          fit="cover"
          height="100"
          lazy-load
          :src="getImageUrl(img.url, 100, 100)"
          @click="$emit('insert', img)"
        />
      </div>
    </div>
    <div v-if="image" ref="cropper" class="avatar-crop">
      <img id="crop-image" :src="image">
      <van-button class="cancel-button" @click="cancel">取 消</van-button>
      <van-button type="primary" class="confirm-button" @click="confirmCrop">确 定</van-button>
    </div>
  </van-popup>
</template>

<script>
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import RestDAO from '../../utils/restdao'
import ImageDAO from '../../utils/imagedao'
import { getImageUrl } from '../../xd-builder/mixins/imageUtils'

export default {
  name: 'PopupImageList',
  components: {  },
  props: {
    uploader: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      images: [],
      fetched: false,
      show: false,
      image: null
    }
  },
  created () {
    this.restdao = new RestDAO(this.ctx, `danke/image`)
    this.imagedao = new ImageDAO(this.ctx)
  },
  methods: {
    getImageUrl,
    cancel () {
      this.cropper.destroy()
      this.image = null
    },

    confirmCrop () {
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
        imageObject.size = blob.size
        let result = await this.imagedao.uploadBlob(blob, `images`)
        imageObject.url = result.name
        // write file info
        await this.restdao.create(imageObject)
        await this.loadMyImages()
      }, 'image/jpeg')
    },
    open () {
      this.show = true
      this.loadMyImages()
    },
    async loadMyImages () {
      if (!this.fetched) {
        this.images = (await this.restdao.list({
          page: 1,
          count: 50
        })).list
      }
    },
    fileRead (file) {
      this.image = file.content
      this.$nextTick(() => {
        const image = document.getElementById('crop-image');
        this.cropper = new Cropper(image, {
          background: false,
          dragMode: 'move',
          crop(event) {},
        });
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


    }
  }
}
</script>

<style lang="scss">
.avatar-crop {
  background: #000;
  overflow: hidden;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
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
