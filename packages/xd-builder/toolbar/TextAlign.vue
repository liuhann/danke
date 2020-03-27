<template>
  <span>
    <a class="action" @click="setTextAlignment('left')"><img :src="ICON_TEXT_LEFT"></a>
    <a class="action" @click="setTextAlignment('center')"><img :src="ICON_TEXT_CENTER"></a>
    <a class="action" @click="setTextAlignment('right')"><img :src="ICON_TEXT_RIGHT"></a>
  </span>
</template>

<script>
import ICON_TEXT_LEFT from './res/text-align-left.svg'
import ICON_TEXT_RIGHT from './res/text-align-right.svg'
import ICON_TEXT_CENTER from './res/text-align-center.svg'
export default {
  name: 'FontAlign',
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      ICON_TEXT_LEFT,
      ICON_TEXT_RIGHT,
      ICON_TEXT_CENTER
    }
  },
  methods: {
    setTextAlignment (align) {
      this.$emit('input', align)
    }
  }
}
</script>

<style scoped>

</style>
