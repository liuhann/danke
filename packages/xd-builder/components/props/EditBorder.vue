<template>
<div class="edit-border">
  <div class="field has-addons">
    <div class="control icon-label">
      <img class="svg-icon" :src="SVG_BORDER">
    </div>
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
  <div class="field has-addons">
    <p class="control icon-label">
      <img class="svg-icon" :src="SVG_CORNER">
    </p>
    <p class="control">
      <edit-len v-model="border.radius" label="" :with-unit="false" unit-label="像素"></edit-len>
    </p>
  </div>
</div>
</template>

<script>
import SVG_BORDER from '../../svg/broken-lines-square-border.svg'
import SVG_CORNER from '../../svg/corner.svg'
import FormField from './FormField'
import EditLen from './EditLen.vue'
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
      SVG_CORNER,
      SVG_BORDER,
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
