<template>
<div class="edit-background">
  <div class="field has-addons">
    <p class="control field-lb">
      背景
    </p>
    <p class="control">
      <el-color-picker v-for="(color, index) of background.colors" :key="index" v-model="background.colors[index]" size="mini" :show-alpha="true" :predefine="predefineColors" />
      删除
    </p>
    <p class="control">
      <el-button type="text" icon="el-icon-plus" size="mini" @click="addColor"/>
    </p>
    <div class="control" style="width: 80px;">
      <div class="is-small" v-if="multipleColor">
        <el-select v-model="background.angle" size="mini">
          <el-option v-for="option in gradientAngle" :value="option.key" :key="option.key" :label="option.value"/>
        </el-select>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { ColorPicker, Select, Option, Button } from 'element-ui'
import { backgroundSize } from '../../danke-core/utils/css-options.js'
import predefineColors from './colors.js'
export default {
  name: 'EditBackground',
  components: {
    [ColorPicker.name]: ColorPicker,
    [Select.name]: Select,
    [Button.name]: Button,
    [Option.name]: Option
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      predefineColors
    }
  },

  created () {

  },

  computed: {
    multipleColor () {
      return this.background.colors.filter(n => n).length > 1
    },

    background () {
      return this.value
    },

    gradientAngle () {
      return [{
        key: 'to bottom',
        value: '上下'
      }, {
        key: 'to right',
        value: '左右'
      }, {
        key: 'to left top',
        value: '左上'
      }, {
        key: 'to right top',
        value: '右上'
      }]
    },

    backgroundSizeOptions () {
      return backgroundSize
    },
    backgroundPositions () {
      return [{
        key: 'top left',
        value: '左上'
      }, {
        key: 'top center',
        value: '中上'
      }, {
        key: 'center left',
        value: '左中'
      }, {
        key: 'center center',
        value: '正中'
      }, {
        key: 'bottom left',
        value: '左下'
      }, {
        key: 'bottom center',
        value: '中下'
      }, {
        key: 'bottom right',
        value: '右下'
      }, {
        key: 'center right',
        value: '右中'
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
      this.background.colors.push('#fff')
    },

    removeColor (index) {
      this.background.colors.splice(index, 1)
    },

    fileChoosed (e) {
      if (e.currentTarget.files.length) {
        const file = e.currentTarget.files[0]
        this.ctx.crop(file, this.cropComplete)
      }
    },

    cropComplete (blob) {
      this.background.url = URL.createObjectURL(blob)
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
  .icon-plus-1 {
    vertical-align: top;
    line-height: 1.8rem;
    display: inline-block;
    color: #888;
  }
}
</style>
