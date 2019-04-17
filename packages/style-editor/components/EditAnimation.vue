<template>
<div class="edit-animation-option panel">
  {{label}}
  <form-field label="动画" type="select" v-model="animation.name" clearable :options="animations"></form-field>
  <edit-len label="时长" v-model="animation.duration" :with-unit="false"></edit-len>
  <form-field label="曲线" type="select" v-model="animation.timing" :options="cubicBeziers"></form-field>
  <edit-len label="延迟" v-model="animation.delay" :with-unit="false"></edit-len>
  <edit-len label="次数" v-model="animation.iteration" :with-unit="false"></edit-len>
</div>
</template>

<script>
import EditLen from './EditLen'
import ItemBlock from './ItemBlock'
import cubicBeziers from '../../frame-tool/model/cubic-beziers'
import FormField from '../../common/FormField'
export default {
  name: 'EditAnimation',
  components: {
    FormField,
    ItemBlock,
    EditLen
  },
  props: {
    label: {
      type: String
    },
    animation: {
      type: Object
    },
    value: {
      type: Object
    },
    animations: {
      type: Array
    }
  },
  data () {
    return {
      cubicBeziers
    }
  },
  computed: {
    font () {
      return this.value
    }
  },

  watch: {
    font () {
      this.$emit('input', this.font)
    }
  },
  methods: {

  }
}
</script>

<style>

</style>
