<template>
<div class="scene-edit-wrapper">
  <van-nav-bar title="场景配置" @click-right="close" @click-left="addEmptyScene">
    <van-icon name="cross" slot="right" />
  </van-nav-bar>

  <div class="pop-content">
    <item-block title="类型">
      <select v-model="scene.type">
        <option value="slide">普通</option>
        <option value="background">背景</option>
        <option value="forground">前景</option>
      </select>
    </item-block>
    <edit-background v-model="scene.background"></edit-background>
    <item-block title="类型">
      <select v-model="scene.type">
        <option value="slide">普通</option>
        <option value="background">背景</option>
        <option value="forground">前景</option>
      </select>
    </item-block>
  </div>

</div>
</template>

<script>
import ItemBlock from '../forms/ItemBlock'
import EditBackground from '../forms/EditBackground'
export default {
  name: 'ConfigScene',
  components: {
    EditBackground,
    ItemBlock
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      scene: this.value
    }
  },
  watch: {
    config (val) {
      this.config = val
    }
  },

  created () {
  },

  methods: {

  }
}
</script>

<style lang="less">
.scene-edit-wrapper {

}
</style>
