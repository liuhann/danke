<template>
  <div class="insert">
    <pop-album-vector :show="show" :tabs="tabs" @insert="insertNode" />
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
        type: 'basic',
        key: 'basic',
        title: '基础'
      }, {
        type: 'upload',
        key: 'upload',
        title: '图片'
      }, {
        key: 'avatar',
        type: 'pack',
        title: '卡通头像'
      }, {
        type: 'pack',
        key: 'art',
        title: '设计'
      }, {
        type: 'pack',
        key: 'scenery',
        title: '图库'
      }]
    }
  },

  computed: {
    position () {
      if (this.isMobile) {
        return "bottom"
      } else {
        return 'right'
      }
    },
    popoverStyle () {
      if (this.isMobile) {
        return {
          height: '50%'
        }
      } else {
        return {
          height: '100%',
          width: '480px'
        }
      }
    }
  },
  created () {
  },

  mounted () {},

  methods: {
    insertNode () {

    }
  }
}
</script>

<style lang="scss">
</style>
