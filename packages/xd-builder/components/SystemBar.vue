<template>
  <div class="system-bar">
    <div class="left">
      <el-button plain type="primary">创作中心</el-button>
      <el-popover
        placement="bottom-start"
        popper-class="file-menu-pop"
        :visible-arrow="false"
        width="440"
        trigger="click"
      >
        <div class="pop-body">
          <div class="menu-item"><el-button @click="$emit('command', 'save-work')">保存</el-button></div>
          <div v-if="work" class="menu-item">
            宽: <el-input-number v-model="work.viewBox.width" size="mini" controls-position="right" />高: <el-input-number v-model="work.viewBox.height" size="mini" controls-position="right" /> 
            <el-button size="mini" type="success" @click="$emit('command', 'viewbox-resize')">重设页面大小</el-button>
          </div>
        </div>
        <el-button slot="reference">
          文件<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
      </el-popover>
    </div>
    <div class="right">
      <el-dropdown @command="handleCommand">
        <el-button>
          导出/执行<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" placement="bottom-start">
          <el-dropdown-item icon="el-icon-plus" command="export-video">导出视频</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: "SystemBar",
  props: {
    work: {
      type: Object
    }
  },
  data () {
    return {

    }
  },
  methods: {
    handleCommand (command) {
      this.$emit('command', command)
    }
  }
}
</script>

<style lang="scss">

.file-menu-pop {
  padding: 0;

  .menu-item {
    padding: 10px;
    border-bottom: 1px solid #00c4cc;
    display: flex;
  }
}

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
