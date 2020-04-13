<template>
  <span>
    <a class="action" @click="setTextAlignment('left')"><icon-text-left /></a>
    <a class="action" @click="setTextAlignment('center')"><icon-text-center /></a>
    <a class="action" @click="setTextAlignment('right')"><icon-text-right /></a>
  </span>
</template>

<script>
import IconTextLeft from './res/text-align-left.svg'
import IconTextRight from './res/text-align-right.svg'
import IconTextCenter from './res/text-align-center.svg'
export default {
  name: 'FontAlign',
  props: {
    value: {
      type: String
    }
  },
  components: {
    IconTextLeft,
    IconTextRight,
    IconTextCenter
  },
  data () {
    return {
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
