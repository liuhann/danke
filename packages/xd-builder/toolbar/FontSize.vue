<template>
  <span>
    <el-tooltip content="字体大小">
      <el-select
        v-model="variable.value"
        size="mini"
        filterable
        allow-create
        placeholder="字号">
        <el-option
          v-for="item in fontSizeOptions"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-tooltip>
    <el-tooltip content="放大字体">
      <a class="action" @click="increaseFontSize(variable)">
        <icon-font-plus />
      </a>
    </el-tooltip>
    <el-tooltip content="缩小字体">
      <a class="action" @click="decreaseFontSize(variable)">
        <icon-font-minus />
      </a>
    </el-tooltip>
  </span>

</template>

<script>
import toolbarPopMixin from './toolbarPopMixin'
import IconFontPlus from './res/font-big.svg'
import IconFontMinus from './res/font-small.svg'
export default {
  name: 'FontSize',
  mixins: [toolbarPopMixin],
  components: {
    IconFontPlus,
    IconFontMinus
  },
  props: {
    variable: {
      type: Object
    }
  },
  data () {
    return {
      fontSizeOptions: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 48, 56, 64, 72, 80, 90]
    }
  },
  methods: {
    increaseFontSize (variable) {
      variable.value = parseInt(variable.value) + 2
    },
    decreaseFontSize (variable) {
      variable.value = parseInt(variable.value) - 2
    }
  }
}
</script>

<style scoped>

</style>
