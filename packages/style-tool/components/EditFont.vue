<template>
<div class="edit-font panel">
  <edit-len v-model="font.size" label="字体大小" :with-unit="false"></edit-len>
  <form-field label="颜色">
    <color-pickr v-model="font.color"></color-pickr>
  </form-field>
  <form-field label="粗细" type="radio" v-model="font.weight" :options="weights"></form-field>
  <form-field label="对齐" type="radio" v-model="font.align" :options="aligns"></form-field>
  <edit-len v-model="font.padding" label="边距" :with-unit="false"></edit-len>
</div>
</template>

<script>
import EditLen from './EditLen.vue'
import FormField from '../../common/FormField'
import ColorPickr from '../../common/ColorPickr'
export default {
  name: 'EditFont',
  components: {
    ColorPickr,
    FormField,
    EditLen
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      weights: [{
        key: 'bold',
        value: '粗'
      }, {
        key: 'normal',
        value: '细'
      }],
      aligns: [{
        key: 'left',
        value: '左'
      }, {
        key: 'center',
        value: '居中'
      }, {
        key: 'right',
        value: '右'
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
