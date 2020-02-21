<template>
<div id="addon-color-list">
  <div class="color-container">
    <div class="addon-title">
      选择颜色
    </div>
    <div class="addon-title">
      常用颜色
    </div>
    <div class="addon-title">
      浅色渐变
    </div>
    <div class="addon-title">
      深色渐变
    </div>
    <div class="lights-gradient">
    </div>
  </div>
</div>
</template>

<script>
import lights from './lights'
export default {
  name: 'AddonBackgroundList',
  props: {
    color: {
      type: [Number, Object]
    }
  },
  data () {
    return {
      lights
    }
  }
}
</script>

<style lang="scss">

</style>
