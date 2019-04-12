<template>
<item-block :title="label" class="item-block" @touch-start="touchStart" @touch-move="touchMove">
  <el-input-number @change="stepChange" size="mini" v-model="length" :step="step || 1"></el-input-number>
  <el-select v-model="unit" size="mini" style="width: 75px;margin-left: 5px" v-if="withUnit">
    <el-option v-for="u of units" :key="u.value" :value="u.value" :label="u.label"></el-option>
  </el-select>
  <slot></slot>
</item-block>
</template>

<script>
import ItemBlock from './ItemBlock'
const REG_LEN = /([+-]?[0-9#]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/
export default {
  components: { ItemBlock },
  props: {
    label: {
      type: String
    },
    value: {
      type: [String, Number]
    },
    units: {
      type: Array,
      default () {
        return [{
          value: 'vw',
          label: '屏宽'
        }, {
          value: 'vh',
          label: '屏高'
        }, {
          value: 'px',
          label: '像素'
        }]
      }
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
      type: Number,
      default: 1
    }
  },
  name: 'EditLen',
  watch: {
    value () {
      this.setDataFromValue()
    },
    length () {
      if (this.withUnit) {
        this.$emit('input', this.length + this.unit)
      } else {
        this.$emit('input', this.length)
      }
    },
    unit () {
      if (this.unit) {
        this.$emit('input', this.length + this.unit)
      } else {
        this.$emit('input', this.length)
      }
      this.$emit('change')
    }
  },
  data () {
    return {
      lastTouchMoveX: 0,
      length: 0,
      unit: 'vw'
    }
  },

  created () {
    this.setDataFromValue()
  },

  methods: {
    setDataFromValue () {
      if (typeof this.value === 'string') {
        let lu = this.getLengthUnit(this.value)
        this.length = lu.number || 0
        this.unit = lu.unit
      } else {
        this.length = this.value
      }
    },

    touchStart (e) {
      this.lastTouchMoveX = e.touches[0].clientX
    },

    touchMove (e) {
      const deltaX = e.touches[0].clientX - this.lastTouchMoveX

      if (Math.abs(deltaX) > 5) {
        this.length = parseInt(this.length) + Math.floor(deltaX / 2) * this.step
        if (this.max && this.length > this.max) {
          this.length = this.max
        }
        if (this.length < this.min) {
          this.length = this.min
        }
        this.lastTouchMoveX = e.touches[0].clientX
      }
    },

    stepChange () {
      this.$emit('step-change')
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
