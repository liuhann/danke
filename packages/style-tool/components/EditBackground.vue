<template>
<div class="edit-background panel">
  <form-field label="背景颜色">
    <span v-for="(color, index) of background.colors" :key="index">
      <color-pickr v-model="background.colors[index]"></color-pickr>
    </span>
    <a class="icon-plus" @click="addColor"></a>
  </form-field>
  <form-field label="渐变方向" type="radio" v-model="background.angle" :options="gredientAngle"></form-field>
  <!--<form-field label="背景位置" type="select" v-model="background.position" :options="backgroundPositions"></form-field>-->
</div>
</template>

<script>
import FormField from '../../common/FormField'
import ColorPickr from '../../common/ColorPickr'
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
      return [{
        key: 'auto',
        value: '原始大小'
      }, {
        key: 'cover',
        value: '覆盖'
      }, {
        key: 'contain',
        value: '包含'
      }, {
        key: 'auto 100%',
        value: '匹配高度'
      }, {
        key: '100% auto',
        value: '匹配宽度'
      }]
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
