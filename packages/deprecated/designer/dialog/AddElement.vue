<template>
  <el-tabs class="tabs-select-element">
    <el-tab-pane label="基本元素">
      <div v-for="basic of TYPES" :key="basic.type" class="list-type">
        <i :class="basic.icon"></i>
        <div class="info">
          <div class="title">{{basic.title}}</div>
          <div class="label">{{basic.label}}</div>
        </div>
        <el-button size="mini" type="text" @click="choose(basic.type)">新增</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="插件元素">

    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: 'AddElement',
  components: {
  },
  data () {
    return {
      TYPES: [{
        icon: 'el-icon-picture',
        title: '形状',
        type: 'image',
        label: '可选择图片、设置形状及背景'
      }, {
        icon: 'el-icon-document',
        title: '文字',
        type: 'text',
        label: '可编辑的文字'
      }],
    }
  },
  methods: {
    choose (name) {
      this.$emit('selected', name)
    }
  }
}
</script>

<style lang="less">
.tabs-select-element {
  .list-type {
    display: flex;
    border-bottom: 1px solid #eee;
    padding: 8px;
    i {
      font-size: 24px;
      line-height: 36px;
      margin-right: 10px;
    }
    .info {
      flex: 1;
    }
    .label {
      font-size: 12px;
    }

  }
}
</style>
