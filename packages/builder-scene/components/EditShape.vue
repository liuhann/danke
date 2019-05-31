<template>
<div class="edit-shape panel">
  <form-field label="类型" type="radio" v-model="shape.type" :options="weights"></form-field>
</div>
</template>

<script>
export default {
  name: 'EditShape',
  props: {

  },
  computed: {

  }
}

</script>

<style>

</style>
