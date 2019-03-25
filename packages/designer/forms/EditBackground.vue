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
  <edit-image title="图片" :background="true" v-model="background.image"></edit-image>

  <item-block title="背景大小">
    <select v-model="background.size">
      <option value="auto">原始大小</option>
      <option value="cover">覆盖</option>
      <option value="contain">包含</option>
      <option value="auto 100%">匹配高度</option>
      <option value="100% auto">匹配宽度</option>
    </select>
  </item-block>

  <item-block title="背景重复">
    <van-checkbox v-model="background.repeat">是</van-checkbox>
  </item-block>

  <item-block title="背景位置">
    <select v-model="background.position">
      <option value="top left">左上</option>
      <option value="top center">中上</option>
      <option value="center left">左中</option>
      <option value="center center">正中</option>
      <option value="center right">右中</option>
      <option value="bottom left">左下</option>
      <option value="bottom center">中下</option>
      <option value="bottom right">右下</option>
    </select>
  </item-block>

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
