<template>
<div class="edit-background section">
  <van-cell class="group-title" title="背景" icon="expand-o" />
  <item-block title="模式">
    <select v-model="background.mode">
      <option value="1">纯色</option>
      <option value="2">渐变</option>
      <option value="0">透明</option>
    </select>
  </item-block>

  <item-block title="颜色" v-if="background.mode==='1'">
    <pop-color-picker v-model="background.color"></pop-color-picker>
  </item-block>

  <item-block title="渐变颜色" v-if="background.mode==='2'">
    <pop-gradient-picker v-model="background.gradients" :angle="background.angle" ></pop-gradient-picker>
  </item-block>

  <item-block title="渐变模式" v-if="background.mode==='2'">
    <select v-model="background.angle">
      <option value="to bottom">上下</option>
      <option value="to right">左右</option>
    </select>
  </item-block>
  <edit-image title="图片混合" :background="true" v-model="background.image"></edit-image>
</div>
</template>

<script>
import PopColorPicker from './PopColorPicker'
import ItemBlock from './ItemBlock'
import PopGradientPicker from './PopGradientPicker'
import EditImage from './EditImage'
export default {
  name: 'EditBackground',
  components: {
    EditImage,
    ItemBlock,
    PopColorPicker,
    PopGradientPicker
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      background: this.value
    }
  },

  computed: {
    background () {
      return this.value
    }
  },

  watch: {
    background: {
      deep: true,
      handler: function () {
        this.$emit('input', this.background)
      }
    }
  },

  methods: {

  }
}
</script>

<style>

</style>
