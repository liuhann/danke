<template>
<div class="edit-image" :style="displayStyle">
  <el-upload
    action="http://www.danke.fun"
    :before-upload="beforeUpload">
    <el-button v-if="!src" size="small" type="text">选择上传</el-button>
  </el-upload>
  <i v-if="src" class="el-icon-delete" @click="removeSrc"></i>
</div>
</template>

<script>
export default {
  name: 'EditImage',
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      src: this.value
    }
  },

  watch: {
    'value': function () {
      this.src = this.value
    }
  },
  computed: {
    displayStyle () {
      if (this.src) {
        return {
          backgroundImage: `url('${this.src}')`
        }
      } else {
        return {}
      }
    }
  },
  methods: {
    beforeUpload (file) {
      if (file.size > this.maxSize) {
        return
      }
      const blobUrl = URL.createObjectURL(file)

      var img = new Image()
      img.onload = () => {
        this.src = blobUrl
        file.height = img.height
        file.width = img.width
        this.$emit('file-add', file)
        this.file = file
      }
      img.src = blobUrl
      this.$emit('input', blobUrl)
      return false
    },

    removeSrc () {
      this.src = ''
      this.$emit('input', '')
      this.$emit('file-remove', this.file)
    }
  }
}
</script>

<style lang="scss">
.edit-image {
  position: relative;
  background-position: center;
  background-color: #efefef;
  background-size: contain;
  background-repeat: no-repeat;
  width: 200px;
  height: 90px;

  .el-icon-delete {
    position: absolute;
    background: rgba(0,0,0,.8);
    color: #fff;
    padding: 10px;
    right: 0;
    top: 0;
    cursor: pointer;
  }
}

</style>
