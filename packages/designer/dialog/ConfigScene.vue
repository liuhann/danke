<template>
<div class="scene-edit-wrapper">
  <div class="pop-content">
    <item-block title="名称">
      <van-field v-model="scene.title" clearable autosize></van-field>
    </item-block>
    <item-block title="类型">
      <select v-model="scene.type">
        <option value="slide">普通</option>
        <option value="background">背景</option>
        <option value="foreground">前景</option>
      </select>
    </item-block>
    <item-block title="切换时间" v-if="scene.type === 'slide'">
      <van-stepper v-model="scene.duration" integer disable-input :step="50"/>
    </item-block>
    <edit-background v-model="scene.background"></edit-background>
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
    value (val) {
      this.scene = val
    },
    scene () {
      this.$emit('input', this.scene)
    }
  },

  created () {
  },

  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less">
.scene-edit-wrapper {
  background-color: #fff;
}
</style>
