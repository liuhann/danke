<template>
  <div class="btn-edit-text">
    <van-button round icon="edit" @click="show=true"></van-button>
    <van-popup v-model="show" position="top" :style="{ height: '50%' }">
      <van-form>
        <!--设置文本的内容-->
        <van-field
          :value="value"
          autofocus
          type="textarea"
          rows="5"
          placeholder="插入文本内容"
          @change="textChanged"
        >
          <template #label />
        </van-field>
      </van-form>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "BtnEditText",
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    textChanged (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style scoped>

</style>
