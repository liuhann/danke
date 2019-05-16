<template>
<div class="edit-border panel">
  <edit-len v-model="border.width" label="边框宽度" :with-unit="false"></edit-len>
  <form-field label="样式" v-model="border.style" type="select" :options="lineStyles"></form-field>
  <form-field label="颜色">
    <color-pickr v-model="border.color"></color-pickr>
  </form-field>
  <edit-len v-model="border.radius" label="圆角" :with-unit="false"></edit-len>
</div>
</template>

<script>
import ItemBlock from './ItemBlock'
import FormField from '../../common/FormField'
import EditLen from './EditLen'
import ColorPickr from '../../common/ColorPickr'
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
    ColorPickr,
    EditLen,
    FormField,
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
      return [{
        key: 'solid',
        value: '实线'
      }, {
        key: 'dotted',
        value: '虚点线'
      }, {
        key: 'dashed',
        value: '虚划线'
      }, {
        key: 'double',
        value: '双层'
      }, {
        key: 'none',
        value: '无边框'
      }, {
        key: 'inset',
        value: '嵌入线'
      },]
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
