<template>
<div class="edit-border panel">
  <div class="field is-horizontal">
    <div class="field-label is-small">
      <label class="label">边框</label>
    </div>
    <div class="field-body is-small">
      <p class="control">
        <edit-len v-model="border.width" :with-unit="false" unit-label="像素"></edit-len>
      </p>
      <p class="control">
        <span class="select is-small">
          <select v-model="border.style">
            <option v-for="option in LINE_STYLES" :value="option.key" :key="option.key">{{option.value}}</option>
          </select>
        </span>
      </p>
      <p class="control">
        <color-pickr v-model="border.color"></color-pickr>
      </p>
    </div>
  </div>
  <div class="field is-horizontal">
    <div class="field-label is-small">
      <label class="label">圆角</label>
    </div>
    <div class="field-body is-small">
      <p class="control">
        <edit-len v-model="border.radius" label="" :with-unit="false" unit-label="像素"></edit-len>
      </p>
    </div>
  </div>
</div>
</template>

<script>
import FormField from './FormField'
import EditLen from './EditLen'
import ColorPickr from '../ColorPickr'
import { LINE_STYLES } from '../../../danke-core/css-model/border'
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
    FormField
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
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
