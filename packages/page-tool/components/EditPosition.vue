<template>
<div class="edit-position panel">
  <form-field label="横向对齐" type="radio" v-model="position.horizontal" :options="horizontalOptions"></form-field>
  <edit-len label="横向偏移" v-model="position.offsetX" :min="-1000" :max="1000"></edit-len>
  <form-field label="纵向对齐" type="radio" v-model="position.vertical" :options="verticalOptions"></form-field>
  <edit-len label="纵向偏移" v-model="position.offsetY"></edit-len>
</div>
</template>

<script>
import EditLen from './EditLen'
import FormField from '../../common/FormField'
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
      // position: this.value
    }
  },
  computed: {
    position () {
      return this.value
    },
    verticalOptions () {
      return [{
        key: 'top',
        value: '上'
      }, {
        key: 'center',
        value: '居中'
      }, {
        key: 'bottom',
        value: '下'
      }]
    },
    horizontalOptions () {
      return [{
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
