<template>
<div class="edit-text">
  <van-cell class="group-title" title="编辑文字" icon="expand-o" />
  <van-field v-model="value" disabled/>
</div>
</template>

<script>
export default {
  name: 'EditText',
  props: {
    value: {
      type: String
    }
  }
}
</script>
