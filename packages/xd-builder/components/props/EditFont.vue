<template>
<div class="edit-font field-group">
  <div class="field has-addons">
    <p class="control icon-label" @click="copyStyle">
      <i class="icon-fontsize"></i>
    </p>
    <p class="control">
      <edit-len v-model="font.size" unit-label="倍" :with-unit="false" :step="0.2"></edit-len>
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
    <div v-if="copied" class="control paste" @click="pasteStyle">
      <i class="icon-paste"></i>
    </div>
  </div>
</div>
</template>

<script>
import EditLen from './EditLen.vue'
import FormField from './FormField.vue'
import ToggleGroupedButton from './ToggleGroupedButton.vue'
import ToggleButton from './ToggleButton.vue'
import ColorPickr from '../ColorPickr.vue'
import pastable from './pastable'
export default {
  name: 'EditFont',
  mixins: [ pastable ],
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
      ctxKey: 'fontCopied',
      propKey: 'font',
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
    copySizeStyle () {
      this.copied = {
        font: JSON.parse(JSON.stringify(this.font))
      }
      this.ctx.fontCopied = this.copied
    }
  }
}
</script>

<style>

</style>
