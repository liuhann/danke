<template>
<div class="edit-image">
  <van-cell class="group-title" title="编辑图片" icon="expand-o" />
  <item-block title="选择">
    <van-uploader :after-read="onRead">
      <div class="image-display" :style="displayStyle">
        {{image.src? '': '点击选择图片'}}
      </div>
    </van-uploader>
  </item-block>
</div>
</template>

<script>
import ItemBlock from './ItemBlock'
export default {
  name: 'EditImage',
  components: {ItemBlock},
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      image: this.value
    }
  },
  computed: {
    displayStyle () {
      if (this.image.src) {
        return `background-image: url('${this.image.src}')`
      } else {
        return ''
      }
    }
  },
  methods: {
    onRead ({content, file}) {
      this.image.file = file
      this.image.src = URL.createObjectURL(file)
    }
  }
}
</script>

<style lang="less">
.edit-image {
  .image-display {
    width: 30vw;
    height: 20vw;
    background-color: #ebedf0;
    background-size: cover;
    margin: 5px;
    text-align: center;
    line-height: 20vw;
    align-items: center;
    color: #666;
  }
}

</style>
