<template>
<div class="edit-background panel">
  <form-field label="背景"></form-field>
  <form-field label="背景颜色">
    <color-pickr v-for="(color, index) of background.colors" :key="index" v-model="background.colors[index]"></color-pickr>
    <a class="icon-plus" @click="addColor"></a>
  </form-field>
  <form-field label="渐变方向" type="radio" v-model="background.angle" :options="gredientAngle"></form-field>
  <!--<form-field label="背景位置" type="select" v-model="background.position" :options="backgroundPositions"></form-field>-->
</div>
</template>

<script>
import FormField from '../../common/components/FormField.vue'
import ColorPickr from '../../common/components/ColorPickr'
import { backgroundSize } from '../../danke-core/utils/css-options.js'
export default {
  name: 'EditBackground',
  components: {
    ColorPickr,
    FormField
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      file: null
    }
  },

  created () {

  },

  computed: {
    background () {
      return this.value
    },

    gredientAngle () {
      return [{
        key: 'to bottom',
        value: '上下'
      }, {
        key: 'to right',
        value: '左右'
      }]

    },

    backgroundSizeOptions () {
      return backgroundSize
    },
    backgroundPositions () {
      return [{
        key: 'top left',
        value: '左上'
      }, {
        key: 'top center',
        value: '中上'
      }, {
        key: 'center left',
        value: '左中'
      }, {
        key: 'center center',
        value: '正中'
      }, {
        key: 'bottom left',
        value: '左下'
      }, {
        key: 'bottom center',
        value: '中下'
      }, {
        key: 'bottom right',
        value: '右下'
      }, {
        key: 'center right',
        value: '右中'
      }]
    }
  },

  watch: {
    background: {
      deep: true,
      handler: function () {
        this.$emit('input', this.background)
      }
    }
  },

  methods: {
    addColor () {
      this.background.colors.push('')
    },

    fileChoosed (e) {
      if (e.currentTarget.files.length) {
        const file = e.currentTarget.files[0]
				this.ctx.crop(file, this.cropComplete)
				// this.$refs.cropper.open(URL.createObjectURL(file))
      }
    },

    cropComplete (blob) {
      this.background.url = URL.createObjectURL(blob)
    },

    addFile (file) {
      this.$emit('add-file', file)
    },
    removeFile (file) {
      this.$emit('remove-file', file)
    }
  }
}
</script>

<style lang="scss">
.edit-background {

}
</style>
