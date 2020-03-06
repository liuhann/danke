<template>
<div class="setting-panel">
  <div class="search">
  </div>
  <div class="share-list">
    <div class="share" @click="slidePreview">
      <div class="icon">
        <i class="el-icon-full-screen" />
      </div>
      <div class="name">新页面预览</div>
      <div class="extro"></div>
    </div>
    <div class="share">
      <div class="icon">
        <i class="el-icon-chat-dot-round" />
      </div>
      <div class="name">微信分享</div>
      <div class="extro"></div>
    </div>
    <div class="share">
      <div class="icon"></div>
      <div class="name">嵌入页面</div>
      <div class="extro"></div>
    </div>
    <div class="share">
      <div class="icon"></div>
      <div class="name">长页面预览</div>
      <div class="extro"></div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'SettingPanel',
  props: {
    work: {
      type: Object
    }
  },
  methods: {
    slidePreview () {
      window.open('')
    }
  }
}
</script>

<style lang="scss">
.setting-panel {
  .share-list {
    .share {
      display: flex;
      height: 4rem;
      line-height: 4rem;
      font-size: 1.5rem;
      color: #293039;
      flex: 1;
      cursor: pointer;
      &:hover {
        background-color: rgba(14,19,24,.07);
      }
      .icon {
        font-weight: bold;
        width: 4rem;
        text-align: center;
        font-size: 2rem;
      }
    }
  }
}

</style>
