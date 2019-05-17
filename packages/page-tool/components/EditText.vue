<template>
<div class="edit-text">
  <form-field label="编辑文本" v-model=""></form-field>
</div>
</template>

<script>
import FormField from '../../common/components/FormField'
export default {
  name: 'EditText',
  components: {FormField},
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
