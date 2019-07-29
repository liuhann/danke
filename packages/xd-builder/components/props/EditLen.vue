<template>
<div class="field is-horizontal">
  <div class="field-body">
    <div class="field has-addons">
      <p class="control">
        <input class="input is-small" style="width: 65px;" type="number" :step="step" v-model="length">
      </p>
      <p class="control">
        <span class="select is-small" v-if="withUnit">
          <select v-model="unit" class="is-small">
            <option v-for="u of units" :key="u.value" :value="u.value" :label="u.label">{{u.label}}</option>
          </select>
        </span>
        <a class="button is-static is-small" v-if="unitLabel">
          {{unitLabel}}
        </a>
      </p>
    </div>
  </div>
</div>
</template>

<script>
import { getLenSplits } from '../../../danke-core/utils/common'
export default {
  props: {
    label: {
      type: String
    },
    unitLabel: {
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
        let lu = getLenSplits(this.value)
        this.length = lu.len || 0
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
    }
  }
}
</script>
