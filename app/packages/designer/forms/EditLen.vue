<template>
<item-block :title="label">
  <van-stepper @plus="stepChange" @minus="stepChange" v-model="length" :min="min || 0" :max="max" :step="step || 1"/>
  <select v-model="unit" v-if="withUnit" slot="end">
    <option value="vw">屏宽</option>
    <option value="vh">屏高</option>
    <option value="px">像素</option>
  </select>
</item-block>
</template>

<script>
import ItemBlock from './ItemBlock'
const REG_LEN = /([+-]?[0-9#]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/
export default {
  components: {ItemBlock},
  props: {
    label: {
      type: String
    },
    value: {
      type: String
    },
    withUnit: {
      type: Boolean,
      default: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number
    },
    step: {
      type: Number
    }
  },
  name: 'EditLen',
  watch: {
    value () {
      this.setDataFromValue()
    },
    length () {
      this.$emit('input', this.length + this.unit)
    },
    unit () {
      this.$emit('input', this.length + this.unit)
      this.$emit('change')
    }
  },
  data () {
    return {
      length: 0,
      unit: 'vw'
    }
  },

  created () {
    this.setDataFromValue()
  },

  methods: {
    setDataFromValue () {
      let lu = this.getLengthUnit(this.value)
      this.length = lu.number
      this.unit = lu.unit
    },
    stepChange () {
      this.$emit('change')
    },
    getLengthUnit (len) {
      // -15vw ->  [-15vw,-15,vw]
      const splits = REG_LEN.exec(len)
      return {
        number: splits[1],
        unit: splits[2]
      }
    }
  }
}
</script>
