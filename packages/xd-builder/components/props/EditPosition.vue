<template>
<div class="edit-position field-group">
  <div class="field has-addons">
    <div class="control icon-label">
      <i class="icon-right"></i>
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
      <i class="icon-up"></i>
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
  margin-bottom:.75rem;
}

</style>
