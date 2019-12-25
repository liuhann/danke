<template>
<div class="edit-filter">
  <div class="field has-addons">
    <div class="control field-lb">
      模糊
    </div>
    <p class="control">
      <edit-len v-model="filter.blur" :with-unit="false" />
    </p>
  </div>
  <div class="field has-addons">
    <div class="control field-lb">
      灰度
    </div>
    <p class="control">
      <edit-len v-model="filter.grayscale" :with-unit="false" />
    </p>
  </div>
  <div class="field has-addons">
    <div class="control field-lb">
      透明度
    </div>
    <p class="control">
      <edit-len v-model="filter.opacity" :with-unit="false" />
    </p>
  </div>
</div>
</template>

<script>
import SVG_CORNER from '../../svg/corner.svg'
import EditLen from './EditLen.vue'
import { LINE_STYLES } from '../../../danke-core/css-model/border'
const allSides = {
  top: '上',
  bottom: '下',
  left: '左',
  right: '右'
}
export default {
  name: 'EditFilter',
  components: {
    EditLen
  },
  props: {
    filter: {
      type: Object
    }
  },
  data () {
    return {
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
