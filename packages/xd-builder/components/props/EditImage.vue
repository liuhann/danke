<template>
<div class="edit-image">
  <div class="field has-addons">
    <p class="control field-lb">
      图片
    </p>
    <p class="control image-preview">
      <img :src="value">
      <a class="file">
        <label class="file-label">
          <input class="file-input" type="file" name="resume" @input="imageChoosed">
          <a class="button is-info is-small">选择</a>
        </label>
      </a>
    </p>
  </div>
</div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  name: 'EditImage',
  components: { Message },
  props: {
    value: {
      type: String
    }
  },
  methods: {
    imageChoosed (e) {
      if (e.currentTarget.files.length) {
        const file = e.currentTarget.files[0]
        if (file.size > this.ctx.upload.maxSize) {
          Message.error('文件最大为' + Math.floor(this.ctx.upload.maxSize / (1024 * 1024)) + 'M')
          return
        }
        this.$emit('input', URL.createObjectURL(file))
        this.$emit('blob', file)
      }
    }
  }
}
</script>

<style lang="scss">
.edit-image {
  height: 180px;
  .image-preview {
    img {
      width: 200px;
      height: 140px;
      object-fit: cover;
    }
  }
}
</style>