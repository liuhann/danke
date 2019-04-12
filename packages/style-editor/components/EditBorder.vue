<template>
<div class="edit-border">
  <item-block title="宽度">
    <el-input-number size="mini" v-model="border.width" :step="1" :min="0"></el-input-number>
  </item-block>
  <item-block title="样式">
    <el-select size="mini" v-model="border.style" placeholder="请选择">
      <el-option
        v-for="(item, key) in lineStyles"
        :key="key"
        :label="item"
        :value="key">
      </el-option>
    </el-select>
  </item-block>
  <item-block title="颜色">
    <el-color-picker v-model="border.color"></el-color-picker>
  </item-block>
  <item-block title="四边">
    <el-checkbox  v-for="(value, key) of allSides" v-model="border.sides[key]" :key="key"
                  :name="key">{{value}}</el-checkbox>
  </item-block>
  <item-block title="圆角" class="radius-setting">
    <el-input-number size="mini" v-model="border.radius" :step="1" :min="0"></el-input-number>
  </item-block>
</div>
</template>

<script>
import ItemBlock from './ItemBlock'
const lineStyles = {
  solid: '实线',
  dotted: '虚点线',
  dashed: '虚划线',
  double: '双层',
  none: '无边框',
  inset: '嵌入线'
}
const allSides = {
  top: '上',
  bottom: '下',
  left: '左',
  right: '右'
}
export default {
  name: 'EditBorder',
  components: {
    ItemBlock
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  computed: {
    border () {
      return this.value
    },
    allSides () {
      return allSides
    },
    lineStyles () {
      return lineStyles
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
