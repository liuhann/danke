<template>
<div class="edit-border">
  <div class="field has-addons">
    <div class="control field-lb">
      边框
    </div>
    <p class="control">
      <edit-len v-model="border.width" :with-unit="false"></edit-len>
    </p>
    <p class="control" style="width: 80px">
      <el-select v-model="border.style" size="mini">
        <el-option v-for="option in LINE_STYLES" :value="option.key" :key="option.key" :label="option.value" />
      </el-select>
    </p>
    <p class="control">
      <el-color-picker v-model="border.color" size="mini" :show-alpha="true" :predefine="predefineColors" />
    </p>
  </div>
  <div class="field has-addons">
    <div class="control field-lb">
      圆角
    </div>
    <p class="control">
      <edit-len v-model="border.radius" label="" :with-unit="false"></edit-len>
    </p>
  </div>
</div>
</template>

<script>
import EditLen from '../components/props/EditLen.vue'
import predefineColors from './colors'
import { Select, Option, ColorPicker } from 'element-ui'
import { LINE_STYLES } from '../../danke-core/css-model/border'
const allSides = {
  top: '上',
  bottom: '下',
  left: '左',
  right: '右'
}
export default {
  name: 'EditBorder',
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    [ColorPicker.name]: ColorPicker,
    EditLen
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      predefineColors,
      LINE_STYLES
    }
  },
  computed: {
    border () {
      return this.value
    },
    allSides () {
      return allSides
    }
  },
  watch: {
    'border': {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  methods: {
    setRadiusSame () {
      const val = this.value.radius[0]
      this.value.radius = [val, val, val, val]
      this.$emit('input', this.value)
    }
  }
}
</script>

<style lang="scss">
.edit-border {

}
</style>
