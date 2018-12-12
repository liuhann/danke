<template>
<div class="element-edit">
  <van-cell-group>
    <van-cell title="单选框 1">
      <van-stepper v-model="x" />
      <van-radio-group v-model="radio">
        <van-radio name="1">单选框 1</van-radio>
        <van-radio name="2">单选框 2</van-radio>
      </van-radio-group>
    </van-cell>
  </van-cell-group>
</div>
</template>

<script>
const REG_LEN = /([+-]?[0-9#]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/
export default {
  name: 'ElementEdit',
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      x: 10,
      xu: 'vw'
    }
  },
  watch: {
    value () {
      this.setDataFromValue()
    }
  },

  created () {

  },

  methods: {
    setDataFromValue () {
      let { number, unit } = this.getLengthUnit(this.value.x)
      this.x = number
      this.xu = unit
    },

    getLengthUnit (len) {
      // -15vw ->  [-15vw,-15,vw]
      const splits = REG_LEN.exec(len)
      return {
        number: splits[1],
        unit: splits[2]
      }
    }
  }
}
</script>

<style scoped>

</style>
