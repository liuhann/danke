<template>
  <div class="drawer_content">
    <div class="pop-title">
      <span class="text">作品设置</span>
      <a class="btn-close" @click="$emit('close')"><i class="el-icon-circle-close" /></a>
    </div>
    <el-form label-width="90px" size="mini" class="more-action-form">
      <el-form size="mini" label-width="80px">
        <el-form-item label="作品名称">
          <el-input v-model="work.title" size="mini" />
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="work.channels" size="mini" multiple>
            <el-option v-for="channel of channels" :key="channel.value" :label="channel.label" :value="channel.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="宽-高">
          <el-input-number v-model="work.viewBox.width" size="mini" controls-position="right" />
          <el-input-number v-model="work.viewBox.height" size="mini" controls-position="right" />
        </el-form-item>
        <el-form-item label="背景颜色">
          <el-color-picker v-model="work.color" />
        </el-form-item>
        <el-form-item label="背景音乐">
          {{ work.audioName || '无' }} 
          <el-button type="text" @click="removeAudio">删除</el-button>
        </el-form-item>
        <el-form-item align="right" class="actions">
          <el-button type="success" size="small" @click="saveWork">
            保存作品
          </el-button>
        </el-form-item>
      </el-form>
    </el-form>
  </div>
</template>

<script>
import workMixin from '../mixins/workMixin.js'
import channels from '../../site/channels'
export default {
  name: 'WorkConfig',
  mixins: [ workMixin ],
  props: {
    work: {
      type: Object
    }
  },
  data () {
    return {
      channels
    }
  },
  computed: { },
  methods: {
    removeAudio () {

    },
    async commitSaveWork () {
      await this.saveWork()
    },
   }
}
</script>

<style lang="scss" scoped>
.more-action-form {
  padding: 16px;
  .el-input-number--mini {
    width: 110px;
    margin: 0 10px;
  }
  .el-input-number.is-controls-right .el-input__inner {
    padding-left: 5px;
    padding-right: 28px;
  }
}
</style>
