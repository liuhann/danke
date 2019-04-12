<template>
<div class="edit-transform">
  <edit-len label="移动X" v-model="transform.translate[0]" :units="translateUnit" :step="10"></edit-len>
  <edit-len label="移动Y" v-model="transform.translate[1]" :units="translateUnit" :step="10"></edit-len>
  <edit-len label="移动Z" v-model="transform.translate[2]" :units="translateUnit" :step="10"></edit-len>
  <edit-len label="缩放" v-model="transform.scale" :with-unit="false"></edit-len>
  <edit-len label="透明度" v-model="transform.opacity" :with-unit="false" :step="0.1"></edit-len>
  <edit-len label="旋转X" v-model="transform.rotate[0]" :units="rotateUnit" :step="10"></edit-len>
  <edit-len label="旋转Y" v-model="transform.rotate[1]" :units="rotateUnit" :step="10"></edit-len>
  <edit-len label="旋转Z" v-model="transform.rotate[2]" :units="rotateUnit" :step="10"></edit-len>
</div>
</template>

<script>
import EditLen from './EditLen'
export default {
  name: 'EditTransform',
  components: { EditLen },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      transform: this.value
    }
  },
  watch: {
    value () {
      this.transform = this.value
    },
    transform: {
      deep: true,
      handler: function () {
        this.$emit('input', this.transform)
      }
    }
  },
  computed: {
    translateUnit () {
      return [{
        value: '%',
        label: '百分比'
      }, {
        value: 'px',
        label: '像素'
      }]
    },
    rotateUnit () {
      return [{
        value: 'deg',
        label: '度'
      }]
    }
  }
}
</script>

<style lang="scss">

</style>
