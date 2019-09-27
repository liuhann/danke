<template>
<div class="field upload-image">
  <div class="file" :class="btnStyle">
    <label class="file-label">
      <input class="file-input" type="file" name="resume" @input="fileChoosed">
      <span class="file-cta">
          <span class="file-label">
            <slot>选择图片</slot>
          </span>
        </span>
    </label>
  </div>
</div>
</template>

<script>
export default {
  name: 'UploadButton.vue',
  props: {
    btnStyle: {
      type: String,
      default: 'medium'
    }
  },
  methods: {
    fileChoosed (event) {
      if (event.currentTarget.files.length) {
        const file = event.currentTarget.files[0]
        this.$emit('file', file)
      }
    }
  }
}
</script>

<style scoped>

</style>
