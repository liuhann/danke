<template>
  <div class="system-bar">
    <div class="left">
      <el-button plain type="primary">创作中心</el-button>
      <el-dropdown @command="handleCommand">
        <el-button>
          文件<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" placement="bottom-start">
          <el-dropdown-item icon="el-icon-plus" command="save-work">保存</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="right">
      <el-button>导出</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SystemBar",
  methods: {
    handleCommand (command) {
      this.$emit('command', command)
    }
  }
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

  .el-button {
    background: transparent;
    border: none;
    color: #fff;
    &:hover {
      background: rgba(255,255,255, .1);
    }
  }
  .right {
    padding: 8px;
  }
}

</style>
