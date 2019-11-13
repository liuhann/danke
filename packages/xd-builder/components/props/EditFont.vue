<template>
<div class="edit-font field-group">
  <div class="field has-addons">
    <div class="control field-lb">
      字体
    </div>
    <edit-len v-model="font.size" unit-label="倍" :with-unit="false" :step="0.2"></edit-len>
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
  </div>
  <div class="field has-addons">
    <div class="control field-lb">
      对齐
    </div>
    <p class="control">
      <toggle-grouped-button :options="aligns" v-model="font.align"></toggle-grouped-button>
    </p>
  </div>
  <div class="field has-addons">
    <div class="control field-lb">
      字体复制
    </div>
    <p class="control">
      <a class="button is-success is-small" @click="$emit('edit')">编辑</a>
      <a class="button is-small" @click="$emit('copy')">样式复制</a>
      <a class="button is-small" @click="$emit('paste')">粘贴</a>
    </p>
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
      }],
      valigns: [{
        key: 'flex-start',
        value: '上'
      }, {
        key: 'center',
        value: '中'
      }, {
        key: 'flex-end',
        value: '下'
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
    applyFontToAll () {
      this.$emit('apply-to-all')
    }
  }
}
</script>

<style lang="scss">
.edit-font {
  .control {
    height: 28px;
  }
}
</style>
