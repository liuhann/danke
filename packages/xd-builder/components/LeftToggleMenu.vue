<template>
<aside class="menu" id="left-toggle-menu">
  <p class="menu-label">
    <a class="button is-white icon-menu" @click="$emit('menu-clicked')"></a>
  </p>
  <ul class="menu-list">
    <li><a>新建</a></li>
    <li><a @click="openWorkListDialog">打开</a></li>
    <li><a @click="saveWork">保存</a></li>
    <li><a @click="editWork">编辑作品信息</a></li>
  </ul>
  <p class="menu-label">
    发布与共享
  </p>
  <ul class="menu-list">
    <li><a>导出</a></li>
    <li><a>共享...</a></li>
  </ul>
  <p class="menu-label">
    用户
  </p>
  <ul class="menu-list">
    <li><a>个人信息</a></li>
    <li><a>我的分享</a></li>
    <li><a>退出</a></li>
  </ul>
</aside>
</template>

<script>
export default {
  inject: ['saveWork', 'openWorkListDialog', 'hideLeftToggleMenu', 'editWork'],
  methods: {
  }
}
</script>

<style lang="scss">
#left-toggle-menu {
  position: absolute;
  left: 0;
  top: 0;
  width: 280px;
  bottom: 0;
  z-index: 9999;
  background: #fff;
  border-right: 1px solid #ccc;
}
</style>
