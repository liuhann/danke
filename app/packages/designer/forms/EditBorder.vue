<template>
<div class="edit-border">
  <van-row type="flex" justify="space-around">
    <van-col span="6" class="tc label">宽度</van-col>
    <van-col span="18">
      <van-stepper v-model="border.width"/>
    </van-col>
  </van-row>
  <van-row type="flex" justify="space-around">
    <van-col span="6" class="tc label">样式</van-col>
    <van-col span="18">
      <select v-model="border.style">
        <option v-for="(value, key) of lineStyles" :value="key" :key="key">{{value}}</option>
      </select>
    </van-col>
  </van-row>
  <van-row type="flex" justify="space-around">
    <van-col span="6" class="tc label">颜色</van-col>
    <van-col span="18">
      <pop-color-picker v-model="border.color"></pop-color-picker>
    </van-col>
  </van-row>
  <van-row type="flex" justify="space-around">
    <van-col span="6" class="tc label">四边</van-col>
    <van-col span="18">
      <van-checkbox-group v-model="border.sides">
        <van-checkbox
          v-for="(value, key) of allSides"
          :key="key"
          :name="key">
          {{value}}
        </van-checkbox>
      </van-checkbox-group>
    </van-col>
  </van-row>

  <van-row type="flex" justify="space-around">
    <van-col span="6" class="tc label">圆角</van-col>
    <van-col span="18" class="radius-setting">
      <van-stepper
        :min="0"
        v-model="border.radius[0]"
      />
      <van-stepper
        :min="0"
        v-model="border.radius[1]"
      />
      <van-stepper
        :min="0"
        v-model="border.radius[2]"
      />
      <van-stepper
        :min="0"
        v-model="border.radius[3]"
      />
    </van-col>
  </van-row>
</div>
</template>

<script>
import PopColorPicker from './PopColorPicker'
const lineStyles = {
  solid: '实线',
  dotted: '虚点线',
  dashed: '虚划线',
  double: '双层',
  none: '无边框',
  inset: '嵌入线',
}
const allSides = {
  top: '上',
  bottom: '下',
  left: '左',
  right: '右'
}
export default {
  name: 'EditBorder',
  components: {
    PopColorPicker
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      border: this.value
    }
  },
  computed: {
    allSides () {
      return allSides
    },
    lineStyles() {
      return lineStyles
    }
  },
  methods: {

  }
}
</script>

<style lang="less">
.edit-border {
  .van-checkbox-group {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .van-checkbox {
      width: 50%;
    }
  }
}
</style>
