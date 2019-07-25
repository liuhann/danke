<template>
<div class="edit-shadow field-group">
  <div class="field has-addons">
    <div class="control icon-label">
      <i class="icon-photo"></i>
    </div>
    <div class="control">
      <a class="button is-static is-small">X</a>
    </div>
    <div class="control">
      <input class="input is-small" style="width: 48px;" type="number" v-model="shadow.x">
    </div>
     <div class="control">
      <a class="button is-static is-small">Y</a>
    </div>
    <div class="control">
      <input class="input is-small" style="width: 48px;" type="number" v-model="shadow.y">
    </div>
     <div class="control">
      <a class="button is-static is-small">B</a>
    </div>
    <div class="control">
      <input class="input is-small" style="width: 48px;" type="number" v-model="shadow.b">
    </div>
    <div class="control">
      <color-pickr v-model="shadow.color"></color-pickr>
    </div>
  </div>
</div>
</template>

<script>
import EditLen from './EditLen.vue'
import SVG_SHADOW from '../../svg/square-shadow.svg'
import ColorPickr from '../ColorPickr.vue'
export default {
  name: 'EditShadow',
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
      SVG_SHADOW
    }
  },
  computed: {
    shadow () {
      return this.value
    }
  },
  created () {

  },
  watch: {

  }
}
</script>

<style lang="scss">
.edit-position {
}

</style>
