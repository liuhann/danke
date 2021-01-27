<template>
  <div class="insert">
    <pop-album-vector :show="show" :tabs="tabs" @insert="insertNode" @close="show = false" />
    <!--插入元素按钮 -->
    <van-button id="add-button" round icon="plus" type="primary" @click="show = true" />
  </div>
</template>

<script>
import PopAlbumVector from './PopAlbumVector'
export default {
  name: "InsertButton",
  components: {
    PopAlbumVector
  },
  data() {
    return {
      show: false,
      isMobile: true,
      tabs: [{
        key: 'basic',
        type: 'basic',
        title: '基础'
      }, {
        key: 'upload',
        type: 'upload',
        title: '图片'
      }, {
        key: 'avatar',
        type: 'pack',
        title: '卡通头像'
      }, {
        key: 'art',
        type: 'pack',
        title: '设计'
      }, {
        type: 'pack',
        key: 'scenery',
        title: '图库'
      }]
    }
  },

  computed: {},
  created () {},

  mounted () {},

  methods: {
    insertNode () {

    }
  }
}
</script>

<style lang="scss">
</style>
