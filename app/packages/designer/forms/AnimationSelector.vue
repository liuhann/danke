<template>
<van-popup v-model="show" position="top">
  <van-picker :columns="columns" show-toolbar @change="onChange" @cancel="onCancel" @confirm="onConfirm"/>
</van-popup>
</template>

<script>
import settings from '../../utils/animations'

export default {
  name: 'AnimationSelector',
  data () {
    const defaultSetting = settings['entrance']
    return {
      show: false,
      source: defaultSetting['entrance'],
      animationClass: '',
      columns: []
    }
  },
  methods: {
    open (type, changeCallback, selectCallback) {
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
      this.animationClass = settings.getAnimationClass(values)
      this.changeCallback(this.animationClass)
    },
    onConfirm () {
      this.show = false
      this.selectCallback(this.animationClass)
    },
    onCancel () {
      this.show = false
    }
  }
}
</script>

<style scoped>

</style>
