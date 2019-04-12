<template>
<div class="edit-text">
  <van-cell class="group-title" title="编辑文字" icon="expand-o" />
  <van-field v-model="text" clearable autosize type="textarea"></van-field>
</div>
</template>

<script>
export default {
  name: 'EditText',
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      text: this.value,
      showEditBox: false
    }
  },

  watch: {
    value () {
      this.text = this.value
    },

    text () {
      this.$emit('input', this.text)
    }
  }

}
</script>

<style lang="scss">
.edit-text {
  .edit {
    padding: 10px 15px;
    background: #fff;
  }
}

.text-edit-pop {
  width: 100%;
  height: 100%;
  textarea {
    font-size: 18px;
  }
}

</style>
