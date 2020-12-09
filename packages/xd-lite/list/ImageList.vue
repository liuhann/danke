<template>
  <div class="image-list">
    <van-uploader :after-read="fileRead" />
    <div v-show="image" class="avatar-crop">
      <cropper ref="cropper" image-restriction="stencil" :src="image" :stencil-props="{
        handlers: {},
        movable: true,
        scalable: true
      }"
      />
    </div>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'

export default {
  name: 'ImageList',
  components: { Cropper },
  props: {
    uploader: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      image: null
    }
  },
  methods: {
    fileRead (file) {
      debugger
      this.image = file.content
    }
  }
}
</script>

<style scoped>
.avatar-crop {
  position: absolute;
  z-index: 10001;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
}
</style>
