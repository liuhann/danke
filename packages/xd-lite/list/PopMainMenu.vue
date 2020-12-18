<template>
  <van-popup v-model="show" position="bottom" :style="{ height: '50%', padding: '8px', background: '#f7f8fa' }">
    <div v-if="pageEnabled" class="main-menu">
      <div class="block_title">页面功能 ({{ currentPage }}/{{ totalPages }}页)</div>
      <van-grid :column-num="4" square clickable>
        <van-grid-item icon="orders-o" text="页面属性" @click="$emit('action', 'scene-setting')" />
        <van-grid-item icon="plus" text="增加页面" @click="$emit('action', 'add-scene')" />
        <van-grid-item icon="arrow-up" text="上一页" @click="$emit('action', 'scene-prev')" />
        <van-grid-item icon="arrow-down" text="下一页" @click="$emit('action', 'scene-next')" />
      </van-grid>
    </div>

    <div class="page-elements">
      <div class="block_title">页内元素</div>
      <van-grid :column-num="4" square clickable>
        <van-grid-item icon="descending" text="排序" @click="$emit('action', 'element-list')" />
        <van-grid-item />
        <van-grid-item />
        <van-grid-item />
      </van-grid>
    </div>

    <div>
      <div class="block_title">作品</div>
      <van-grid :column-num="4" square clickable>
        <van-grid-item icon="success" text="保存" @click="$emit('action', 'save-work')" />
        <van-grid-item icon="share-o" text="分享" @click="$emit('action', 'share-work')" />
        <van-grid-item icon="wap-home-o" text="返回" @click="$emit('action', 'go-home')" />
        <van-grid-item />
      </van-grid>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: "PopMainMenu",
  props: {
    pageEnabled: {
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

<style scoped>
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
