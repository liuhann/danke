<template>
<span>
  <el-select
    v-model="variable.value"
    size="mini"
    filterable
    allow-create
    placeholder="字体">
    <el-option
      v-for="item in fontSizeOptions"
      :key="item"
      :label="item"
      :value="item">
    </el-option>
  </el-select>
  <a class="action" @click="increaseFontSize(variable)"><img :src="ICON_FONT_PLUS"></a>
  <a class="action" @click="decreaseFontSize(variable)"><img :src="ICON_FONT_SMALL"></a>
</span>
</template>

<script>
import toolbarPopMixin from './toolbarPopMixin'
import ICON_FONT_PLUS from './res/font-big.svg'
import ICON_FONT_SMALL from './res/font-smaller.svg'
export default {
  name: 'FontSize',
  mixins: [toolbarPopMixin],
  props: {
    variable: {
      type: Object
    }
  },
  data () {
    return {
      fontSizeOptions: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 36, 40, 48, 56, 64, 72, 80, 90],
      ICON_FONT_PLUS,
      ICON_FONT_SMALL
    }
  },
  methods: {
    increaseFontSize (variable) {
      variable.value += 2
    },
    decreaseFontSize (varialbe) {
      varialbe.value -= 2
    }
  }
}
</script>

<style scoped>

</style>