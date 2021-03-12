<template>
  <div class="menu-button">
    <van-popover v-model="show" class="pop-main-menu" trigger="click" placement="bottom-end">
      <div class="pop-content">
        <div class="paging-actions">
          <div class="block_title">页面功能 ({{ currentPage }}/{{ totalPages }}页)</div>
          <van-grid :column-num="4" square clickable>
            <van-grid-item icon="orders-o" text="页面属性" @click="$emit('action', 'scene-setting')" />
            <van-grid-item icon="plus" text="增加页面" @click="$emit('action', 'add-scene')" />
            <van-grid-item icon="arrow-up" text="上一页" @click="$emit('action', 'scene-prev')" />
            <van-grid-item icon="arrow-down" text="下一页" @click="$emit('action', 'scene-next')" />
          </van-grid>
        </div>
        <div class="main-menu w-80">
          <div class="block_title">作品</div>
          <van-grid :column-num="4" square clickable>
            <van-grid-item icon="success" text="保存" @click="$emit('action', 'save-work')" />
            <van-grid-item icon="share-o" text="分享" @click="$emit('action', 'share-work')" />
            <van-grid-item icon="wap-home-o" text="返回首页" @click="$emit('action', 'go-home')" />
            <van-grid-item />
          </van-grid>
        </div>
      </div>
      <template #reference>
        <van-button round icon="setting-o" />
      </template>
    </van-popover>
  </div>
</template>

<script>
export default {
  name: "PopMainMenu",
  props: {
    pageEnabled: {
      type: Boolean,
      default: true
    },
    work: {
      type: Object
    },
    scene: {
      type: Object
    }
  },
  data () {
    return {
      show: false
    }
  },
  computed: {
    currentPage () {
      return this.work.scenes.indexOf(this.scene) + 1
    },
    totalPages() {
      return this.work.scenes.length
    }
  },
  methods: {
    open () {
      this.show = true
    },
    close () {
      this.show = false
    }
  }

}
</script>

<style lang="scss">
.pop-content {
  width: 300px;
}

.menu-button {
  position: absolute;
  z-index: 1001;
  right: 20px;
  top: 20px;
}

.block_title {
  background: #f7f8fa;
  margin: 0;
  padding: 16px 16px;
  color: rgba(69, 90, 100, 0.6);
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
}
</style>
