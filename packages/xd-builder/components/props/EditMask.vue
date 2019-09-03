<template>
<div class="edit-mask field-group">
  <div class="field has-addons">
    <div class="control icon-label">
      <i class="icon-photo"></i>
    </div>
    <div class="control">
      <span class="button is-small" @click="chooseMaskSVG">{{ '选择'}}</span>
    </div>
    <div class="control">
      <div class="select is-small">
        <select v-model="mask.size">
          <option v-for="option in Sizes" :value="option.key" :key="option.key">{{option.value}}</option>
        </select>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import EditLen from './EditLen.vue'
import { Sizes } from '../../../danke-core/css-model/mask'
import ColorPickr from '../ColorPickr.vue'
export default {
  name: 'EditMask',
  components: {
    EditLen,
    ColorPickr
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      Sizes
    }
  },
  computed: {
    mask () {
      return this.value
    }
  },
  created () {

  },
  watch: {

  },
  methods: {
    chooseMaskSVG () {

    }
  }
}
</script>

<style lang="scss">
.edit-position {
}

</style>
