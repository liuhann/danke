<template>
<div class="edit-background section">
  <item-block title="颜色">
    <span  v-for="(color, index) of background.colors" :key="index">
      <el-color-picker v-model="background.colors[index]"></el-color-picker>
    </span>
    <el-button icon="el-icon-plus" type="text" @click="addColor"></el-button>
  </item-block>

  <item-block title="渐变模式">
    <el-select v-model="background.angle" size="mini">
      <el-option value="to bottom" label="上下"></el-option>
      <el-option value="to right" label="左右"></el-option>
    </el-select>
  </item-block>

  <item-block title="背景大小">
    <el-select size="mini" v-model="background.size" placeholder="请选择">
      <el-option
        v-for="item in backgroundSizeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </item-block>

  <item-block title="背景重复">
    <el-checkbox v-model="background.repeat">是</el-checkbox>
  </item-block>

  <item-block title="背景位置">
    <el-select size="mini" v-model="background.position">
      <el-option
        v-for="item in backgroundPositions"
        :key="item.value"
        :label="item.label"
        :value="item.value"></el-option>
    </el-select>
  </item-block>

</div>
</template>

<script>
import ItemBlock from './ItemBlock'
import EditImage from './EditImage'
export default {
  name: 'EditBackground',
  components: {
    EditImage,
    ItemBlock
  },
  props: {
    value: {
      type: Object
    },
    maxSize: {
      type: Number,
      default: 800000
    }
  },
  data () {
    return {
      file: null
    }
  },

  created () {

  },

  computed: {
    background () {
      return this.value
    },

    imagePreview () {
      if (this.file) {
        return `background-image: url('${this.src}')`
      } else {
        return ''
      }
    },

    backgroundSizeOptions () {
      return [{
        value: 'auto',
        label: '原始大小'
      }, {
        value: 'cover',
        label: '覆盖'
      }, {
        value: 'contain',
        label: '包含'
      }, {
        value: 'auto 100%',
        label: '匹配高度'
      }, {
        value: '100% auto',
        label: '匹配宽度'
      }]
    },
    backgroundPositions () {
      return [{
        value: 'top left',
        label: '左上'
      }, {
        value: 'top center',
        label: '中上'
      }, {
        value: 'center left',
        label: '左中'
      }, {
        value: 'center center',
        label: '正中'
      }, {
        value: 'bottom left',
        label: '左下'
      }, {
        value: 'bottom center',
        label: '中下'
      }, {
        value: 'bottom right',
        label: '右下'
      }, {
        value: 'center right',
        label: '右中'
      }]
    }
  },

  watch: {
    background: {
      deep: true,
      handler: function () {
        this.$emit('input', this.background)
      }
    }
  },

  methods: {
    addColor () {
      this.background.colors.push('')
    },

    addFile (file) {
      this.$emit('add-file', file)
    },
    removeFile (file) {
      this.$emit('remove-file', file)
    }
  }
}
</script>

<style lang="scss">
.edit-background {
  .image-display {
    width: 220px;
    height: 90px;
    background-color: #efefef;
  }
  .upload {
    height: 100px;
    .el-upload {
      display: inherit;
      text-align: center;
      cursor: pointer;
      outline: 0;
      padding: 25px;
    }
  }
}
</style>
