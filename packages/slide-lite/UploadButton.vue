<template>
<div class="field upload-image">
  <div class="file is-centered" :class="btnStyle">
    <label class="file-label">
      <input class="file-input" type="file" name="resume" @input="fileChoosed" :multiple="isMultiple">
        <slot>
      <span class="file-cta">
          <span class="file-label">
            <slot>{{label}}</slot>
          </span>
      </span>
        </slot>
    </label>
  </div>
</div>
</template>

<script>
export default {
  name: 'UploadButton.vue',
  props: {
    isMultiple: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: '选择图片'
    },
    btnStyle: {
      type: String,
      default: 'medium'
    }
  },
  methods: {
    fileChoosed (event) {
      if (this.isMultiple) {
        this.$emit('files', event.currentTarget.files)
      } else {
        const file = event.currentTarget.files[0]
        this.$emit('file', file)
      }
    }
  }
}
</script>

<style scoped>

</style>
