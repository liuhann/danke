<template>
<div class="edit-size">
  <div class="field has-addons">
    <p class="control field-lb">
      宽度
    </p>
    <p class="control">
      <edit-len v-model="value.width"></edit-len>
    </p>
  </div>
  <div class="field has-addons">
    <p class="control field-lb">
      高度
    </p>
    <p class="control">
      <edit-len v-model="value.height"></edit-len>
    </p>
  </div>
</div>

</template>

<script>
import EditLen from '../components/props/EditLen.vue'
export default {
  name: 'EditSize',
  components: {
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
    }
  },
  computed: {
    relates () {
      return [{
        key: '无',
        value: '无'
      }, {
        key: '3:2',
        value: '3:2'
      }, {
        key: '4:3',
        value: '4:3'
      }, {
        key: '16:9',
        value: '16:9'
      }]
    }
  },
  created () {
  },
  watch: {
  },
  methods: {
  }
}
</script>

<style lang="scss">
.edit-size {

}
</style>
