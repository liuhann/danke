<template>
<div class="edit-position field-group">
  <form-field label="横向" type="select" v-model="position.horizontal" :options="horizontalOptions">
    <edit-len v-model="position.offsetX"></edit-len>
  </form-field>
  <form-field label="纵向" type="select" v-model="position.vertical" :options="verticalOptions">
    <edit-len v-model="position.offsetY"></edit-len>
  </form-field>
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
