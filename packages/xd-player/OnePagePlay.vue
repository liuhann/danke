<template>
  <div id="page-play">
  </div>
</template>

<script>
import workMixin from '../xd-builder/mixins/workMixin'
export default {
  mixins: [workMixin],
  data () {
    return {
      work: null,
      containerWidth: window.innerWidth
    }
  },
  
  mounted () {
    this.onMounted()
  },
  
  methods: {
    async onMounted() {
      await this.loadWork()

      const viewBox = this.work.viewBox

      const innerWidth = window.innerWidth

      this.containerWidth = this.getContainerWidth(innerWidth)
      this.containerHeight = parseInt(viewBox.height) / parseInt(viewBox.width) * this.containerWidth
    },

    getContainerWidth (width) {
      if (width>=1408) {
        return 1344
      } else if (width >= 1216) {
        return 1152
      } else if (width >= 1024) {
        return 960
      } else {
        return width
      }
    }
  }
}
</script>

<style>

</style>