<template>
<div class="edit-font field-group">
  <div class="field has-addons">
    <div class="control field-lb">
      字体
    </div>
    <div class="control">
      <el-input-number v-model="font.size" size="mini" controls-position="right" :step="0.2"/>
    </div>
    <div class="control">
      <el-checkbox v-model="font.bold">粗体</el-checkbox>
    </div>
  </div>
  <div class="field has-addons">
    <div class="control field-lb">
      颜色
    </div>
    <p class="control">
      <el-color-picker v-model="font.color" size="mini" :show-alpha="true" :predefine="predefineColors" />
    </p>
  </div>
  <div class="field has-addons">
    <div class="control field-lb">
      对齐
    </div>
    <p class="control">
      <el-radio-group v-model="font.align" size="mini">
        <el-radio v-for="align of aligns" :label="align.key" :key="align.key">{{align.label}}</el-radio>
      </el-radio-group>
    </p>
  </div>
</div>
</template>

<script>
import { Button, InputNumber, ColorPicker, Checkbox, RadioGroup, RadioButton, Radio } from 'element-ui'
import predefineColors from './colors'
import pastable from '../components/props/pastable'
export default {
  name: 'EditFont',
  mixins: [ pastable ],
  components: {
    [Button.name]: Button,
    [InputNumber.name]: InputNumber,
    [ColorPicker.name]: ColorPicker,
    [Checkbox.name]: Checkbox,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [RadioButton.name]: RadioButton
  },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      predefineColors,
      ctxKey: 'fontCopied',
      propKey: 'font',
      aligns: [{
        key: 'left',
        label: '靠左',
        icon: 'icon-align-left'
      }, {
        key: 'center',
        label: '居中',
        icon: 'icon-align-center'
      }, {
        key: 'right',
        label: '靠右',
        icon: 'icon-align-right'
      }],
      valigns: [{
        key: 'flex-start',
        value: '上'
      }, {
        key: 'center',
        value: '中'
      }, {
        key: 'flex-end',
        value: '下'
      }]
    }
  },
  computed: {
    font () {
      return this.value
    }
  },

  watch: {
    font () {
      this.$emit('input', this.font)
    }
  },
  methods: {
    applyFontToAll () {
      this.$emit('apply-to-all')
    }
  }
}
</script>

<style lang="scss">
.edit-font {
}
</style>
