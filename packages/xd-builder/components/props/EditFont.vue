<template>
<div class="edit-font field-group">
  <div class="field has-addons">
    <p class="control icon-label">
      <img class="svg-icon" :src="SVG_FONT_SIZE">
    </p>
    <p class="control">
      <edit-len v-model="font.size" unit-label="倍" :with-unit="false"></edit-len>
    </p>
    <p class="control space">
    </p>
    <p class="control">
      <color-pickr v-model="font.color"></color-pickr>
    </p>
    <p class="control space">
    </p>
    <p class="control">
      <toggle-button v-model="font.bold" icon="icon-bold"></toggle-button>
    </p>
    <p class="control space">
    </p>
    <p class="control">
      <toggle-grouped-button :options="aligns" v-model="font.align"></toggle-grouped-button>
    </p>
  </div>
</div>
</template>

<script>
import SVG_FONT_SIZE from '../../svg/font.svg'
import EditLen from './EditLen.vue'
import FormField from './FormField.vue'
import ToggleGroupedButton from './ToggleGroupedButton.vue'
import ToggleButton from './ToggleButton.vue'
import ColorPickr from '../ColorPickr.vue'
export default {
  name: 'EditFont',
  components: {
    ColorPickr,
    FormField,
    EditLen,
    ToggleButton,
    ToggleGroupedButton
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      SVG_FONT_SIZE,
      aligns: [{
        key: 'left',
        icon: 'icon-align-left'
      }, {
        key: 'center',
        icon: 'icon-align-center'
      }, {
        key: 'right',
        icon: 'icon-align-right'
      }]
    }
  },
  computed: {
    font () {
      return this.value
    }
  },

  watch: {
    font () {
      this.$emit('input', this.font)
    }
  },
  methods: {

  }
}
</script>

<style>

</style>
