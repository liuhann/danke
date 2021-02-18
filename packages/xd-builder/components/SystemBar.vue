<template>
  <div class="system-bar">
    <div class="left">
      <el-button plain type="primary">创作中心</el-button>
      <el-button>文件</el-button>
    </div>
    <div class="right">
      <el-button>导出</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SystemBar"
}
</script>

<style lang="scss">
.system-bar {
  display: flex;
  width: 100%;
  justify-content: space-between;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
          90deg
      ,#00c4cc,#7d2ae8);

  .left {
    padding: 8px;
  }
  .right {
    padding: 8px;
  }
}

</style>
