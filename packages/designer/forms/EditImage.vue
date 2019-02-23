<template>
<div class="edit-image">
  <item-block :title="title">
    <van-uploader :after-read="onRead">
      <div class="image-display" :style="displayStyle">
        {{src? '': '点击选择图片'}}
      </div>
    </van-uploader>
  </item-block>
</div>
</template>

<script>
import ItemBlock from './ItemBlock'
import { Notify } from 'vant'
export default {
  name: 'EditImage',
  components: {ItemBlock},
  props: {
    title: {
      type: String,
      default: '编辑图片'
    },
    value: {
      type: String
    }
  },
  data () {
    return {

    }
  },
  computed: {
    src () {
      return this.value
    },
    displayStyle () {
      if (this.src) {
        return `background-image: url('${this.src}')`
      } else {
        return ''
      }
    }
  },
  methods: {
    onRead ({content, file}) {
      if (file.size > this.ctx.upload.maxSize) {
        Notify('图片不能大于2M')
        return
      }
      const blobUrl = URL.createObjectURL(file)
      this.src = blobUrl
      this.$emit('input', blobUrl)

      this.ctx.workdao.uploadImage(file).then((result)=> {
        debugger
        this.$emit('input', result.url)
      })
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
