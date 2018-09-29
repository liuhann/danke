<template>
  <div class="type-line">
    <div v-for="(char, index) in characters" :key="index" v-html="char" class="animated slideInDown word" :style="styleAnimationDelay(index)"></div>
  </div>
</template>

<script>
import '../style/animate.css'

export default {
  name: 'TypeLine',
  props: {
    content: {
      type: String
    }
  },
  data () {
    return {
    }
  },
  computed: {
    characters () {
      return this.content && [...this.content]
    }
  },
  created () {

  },
  methods: {
    styleAnimationDelay (index) {
      return {
        animationDelay: 100 * index + 'ms'
      }
    }
  }
}
</script>

<style scoped>
  .word {
    min-width: 20px;
    display: inline-block;
  }
</style>
