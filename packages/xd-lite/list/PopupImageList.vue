<template>
  <van-popup
    v-model="show"
    class="pop-image-list"
    :style="{ height: '100%' }"
    position="bottom"
    @opened="opened"
  >
    <van-nav-bar v-show="!croppingImage">
      <template #right>
        <van-icon name="cross" size="24" @click="show=false" />
      </template>
      <template #title>
        选择或上传图片
      </template>
      <template #left>
        <a @click="deleteToggled = !deleteToggled">{{ deleteToggled? '删除完成': '删除' }}</a>
      </template>
    </van-nav-bar>
    <div v-show="!croppingImage">
      <van-uploader :after-read="fileRead" :before-read="beforeRead">
      </van-uploader>
      <van-empty v-if="images.length === 0" description="无历史图片" />

      <van-grid clickable square :icon-size="32" column-num="4" :gutter="5">
        <van-grid-item v-for="(img, index) in images" :key="index" @click="chooseImg(img, index)">
          <van-image lazy-load fit="cover" width="100%" height="100%" :src="getImageUrl(img.url, 100, 100)" />
          <van-icon v-if="deleteToggled" name="clear" size="28" color="rgba(0,0,0, .6)" />
        </van-grid-item>
      </van-grid>
    </div>
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
</template>

<script>
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import RestDAO from '../../utils/restdao'
import ImageDAO from '../../utils/imagedao'
import { Toast } from 'vant'
import { getImageUrl } from '../../utils/getImageUrl'

export default {
  name: 'PopupImageList',
  components: {  },
  props: {
    uploader: {
      type: Boolean,
      default: false
    },
    defaultRatio: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      clipOptions: [{ text: '自由比例'}, { text: '1:1', ratio: 1 }, { text: '4:3', ratio: 1.333 }, { text: '3:4', ratio: 0.75 }, { text: '3:2', ratio: 1.5},  { text: '2:3', ratio: 0.667 }],
      ratio: '1:1',
      showPopover: false,
      images: [],
      deleteToggled: false,
      fetched: false,
      show: false,
      croppingImage: null
    }
  },
  created () {
    this.restdao = new RestDAO(this.ctx, `danke/image`)
    this.imagedao = new ImageDAO(this.ctx)
  },
  methods: {
    getImageUrl,
    cancel () {
      // this.cropper.destroy()
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
    async chooseImg (img, index) {
      if (this.deleteToggled) {
        this.restdao.delete(img)
        this.images.splice(index, 1)
      } else {
        this.show = false
        this.$emit('insert', img)
      }
    },

    beforeRead () {
      Toast.loading('正在读取文件')
      return true
    },
    fileRead (file) {
      this.croppingImage = file.content
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
.pop-image-list {
  .van-grid-item__content {
    padding: 0;
    .van-icon-clear {
      position: absolute;
      right: 2px;
      top: 2px;
    }
  }
  .van-uploader {
    margin: 5px;
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
