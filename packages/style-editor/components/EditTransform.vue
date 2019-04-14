<template>
  <div class="edit-transform">
    <div class="field is-horizontal">
      <div class="field-label is-small">
        <label class="label">移动</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control is-small">
            <input class="input is-small" v-model="transform.translate[0]" type="number" placeholder="x">
          </p>
        </div>
        <div class="field">
          <p class="control is-small">
            <input class="input is-small" v-model="transform.translate[1]" type="number" placeholder="y">
          </p>
        </div>
        <div class="field">
          <p class="control is-small">
            <input class="input is-small" v-model="transform.translate[2]" type="number" placeholder="z">
          </p>
        </div>
      </div>
    </div>
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
