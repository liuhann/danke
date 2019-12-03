<template>
<div class="edit-shadow field-group">
  <div class="field has-addons">
    <div class="control field-lb">
      阴影
    </div>
    <div class="control">
      <el-button size="mini" @click="addTextShadow">新增</el-button>
    </div>
  </div>
  <div class="field has-addons" v-for="(shadow, index) of value" :key="index">
    <div class="control">
      <el-input-number v-model="shadow.x" size="mini" controls-position="right" />
    </div>
    <div class="control">
      <el-input-number v-model="shadow.y" size="mini" controls-position="right" />
    </div>
    <div class="control">
      <el-input-number v-model="shadow.b" size="mini" controls-position="right" />
    </div>
    <div class="control">
      <el-color-picker v-model="shadow.color" size="mini" :show-alpha="true" :predefine="predefineColors" />
    </div>
    <div class="control">
      <el-button size="mini" type="text" icon="el-icon-delete" @click="removeShadow(index)"/>
    </div>
  </div>
</div>
</template>

<script>
import Shadow from '../../danke-core/css-model/shadow'
import { Button, InputNumber, ColorPicker } from 'element-ui'
export default {
  name: 'EditShadow',
  components: {
    [Button.name]: Button,
    [InputNumber.name]: InputNumber,
    [ColorPicker.name]: ColorPicker
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)'
      ]
    }
  },
  computed: {
    shadow () {
      return this.value
    }
  },
  created () {

  },
  watch: {

  },
  methods: {
    addTextShadow () {
      this.value.push(JSON.parse(JSON.stringify(Shadow)))
    },

    removeShadow (index) {
      this.value.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.edit-position {
}

</style>
