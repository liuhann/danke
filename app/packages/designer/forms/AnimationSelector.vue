<template>
<div class="animation-selector">
  <van-button size="small" plain type="primary" @click="isShow = true">{{value || '选择'}}</van-button>
  <van-popup v-model="isShow" position="bottom" :overlay="true" get-container="body">
    <div class="animation-preview">
      <div class="square"></div>
    </div>
    <van-picker :columns="columns" show-toolbar @change="onChange" @cancel="onCancel" @confirm="onConfirm"/>
  </van-popup>
</div>
</template>

<script>
import settings from '../../animations/animations'

export default {
  name: 'AnimationSelector',
  props: {
    type: {
      type: String,
      default: 'entrance'
    },
    value: {
      type: String
    }
  },
  data () {
    const defaultSetting = settings['entrance']
    return {
      isShow: false,
      source: defaultSetting['entrance'],
      animationClass: '',
      columns: [],
      choosedValues: null
    }
  },

  created () {
    this.source = settings[this.type]
    this.columns = [{
      values: Object.keys(this.source),
      className: 'column1',
      defaultIndex: 2
    }, {
      values: this.source[Object.keys(this.source)[0]],
      className: 'column2',
      defaultIndex: 2
    }]
  },

  methods: {
    open1 (type, changeCallback, selectCallback) {
      this.source = settings[type]
      this.columns = [{
        values: Object.keys(this.source),
        className: 'column1',
        defaultIndex: 2
      }, {
        values: this.source[Object.keys(this.source)[0]],
        className: 'column2',
        defaultIndex: 2
      }]
      this.show = true
      this.changeCallback = changeCallback
      this.selectCallback = selectCallback
    },
    onChange (picker, values) {
      picker.setColumnValues(1, this.source[values[0]])
      this.choosedValues = values
      // this.animationClass = settings.getAnimationClass(values)
      // this.$emit('input', settings.getAnimationClass(values))
      // this.changeCallback(this.animationClass)
    },
    onConfirm () {
      this.isShow = false
      if (this.choosedValues && this.choosedValues.length) {
        this.$emit('input', settings.getAnimationClass(this.choosedValues))
      }
      // this.selectCallback(this.animationClass)
    },
    onCancel () {
      this.isShow = false
    }
  }
}
</script>

<style scoped>

</style>
