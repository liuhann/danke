<template>
<div class="edit-position field-group">
  <div class="field has-addons">
    <div class="control icon-label">
      <img class="svg-icon" :src="SVG_HOR">
    </div>
    <div class="control">
      <div class="select is-small">
        <select v-model="position.horizontal">
          <option v-for="option in horizontalOptions" :value="option.key" :key="option.key">{{option.value}}</option>
        </select>
      </div>
    </div>
    <div class="control">
       <edit-len v-model="position.offsetX"></edit-len>
    </div>
  </div>
  <div class="field has-addons">
    <div class="control icon-label">
      <img class="svg-icon" :src="SVG_VER">
    </div>
    <div class="control">
      <div class="select is-small">
        <select v-model="position.vertical">
          <option v-for="option in verticalOptions" :value="option.key" :key="option.key">{{option.value}}</option>
        </select>
      </div>
    </div>
    <div class="control">
       <edit-len v-model="position.offsetY"></edit-len>
    </div>
  </div>
</div>
</template>

<script>
import EditLen from './EditLen'
import SVG_HOR from '../../svg/position-x.svg'
import SVG_VER from '../../svg/position-y.svg'
import FormField from './FormField'
import { horizontalOptions, verticalOptions } from '../../../danke-core/css-model/position'
export default {
  name: 'EditPosition',
  components: {
    FormField,
    EditLen
  },
  props: {
    value: {
      type: Object
    },
    device: {
      type: Object
    }
  },
  data () {
    return {
      SVG_HOR,
      SVG_VER,
      horizontalOptions,
      verticalOptions
    }
  },
  computed: {
    position () {
      return this.value
    }
  },
  created () {

  }
}
</script>

<style lang="scss">
.edit-position {
}

</style>
