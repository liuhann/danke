<template>
<div class="edit-border">
  <div class="field has-addons">
    <div class="control field-lb">
      边框
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
      <el-color-picker v-model="border.color" size="mini" :show-alpha="true" :predefine="predefineColors" />
    </p>
  </div>
  <div class="field has-addons">
    <div class="control field-lb">
      圆角
    </div>
    <p class="control">
      <edit-len v-model="border.radius" label="" :with-unit="false" unit-label="像素"></edit-len>
    </p>
  </div>
</div>
</template>

<script>
import SVG_CORNER from '../svg/corner.svg'
import EditLen from '../components/props/EditLen.vue'
import predefineColors from './colors'
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
      SVG_CORNER,
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
