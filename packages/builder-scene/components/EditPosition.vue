<template>
<div class="edit-position">
  <form-field label="横向对齐" type="radio" v-model="position.horizontal" :options="horizontalOptions"></form-field>
  <edit-len label="横向偏移" v-model="position.offsetX" :min="-1000" :max="1000"></edit-len>
  <form-field label="纵向对齐" type="radio" v-model="position.vertical" :options="verticalOptions"></form-field>
  <edit-len label="纵向偏移" v-model="position.offsetY"></edit-len>
</div>
</template>

<script>
import EditLen from './EditLen'
import FormField from '../../common/components/FormField'
import { horizontalOptions, verticalOptions } from '../../danke-core/css-model/position'
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
.position-preview {
  width: 80vw;
  height: 80vw;
}

</style>
