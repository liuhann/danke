<template>
  <span>
    <el-select
      v-model="variable.value"
      class="mr-3"
      style="width:100px;"
      placeholder="字号"
    >
      <el-option
        v-for="item in fontSizeOptions"
        :key="item"
        :label="item"
        :value="item"
      >
      </el-option>
    </el-select>
    <el-button icon="el-icon-minus" type="text" @click="decreaseFontSize(variable)">缩小</el-button>
    <el-button icon="el-icon-plus" type="text" @click="increaseFontSize(variable)">放大</el-button>
  </span>
</template>

<script>
import toolbarPopMixin from './toolbarPopMixin'
export default {
  name: 'FontSize',
  components: {},
  mixins: [toolbarPopMixin],
  props: {
    variable: {
      type: Object
    }
  },
  data () {
    return {
      fontSizeOptions: [12, 20, 28, 36, 48, 64, 72, 96, 128, 168]
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
