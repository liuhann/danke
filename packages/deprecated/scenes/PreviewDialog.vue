<template>
<div id="preview-dialog" v-show="dialogVisible" @click.self="close">
  <page-play v-if="dialogVisible" ref="play" :scene="scene"></page-play>
</div>
</template>

<script>
import { Dialog } from 'element-ui/types'
import PagePlay from './PagePlay'
import { fitToContainer } from '../../danke-core/utils/common'
export default {
  name: 'PreviewDialog',
  components: { PagePlay, Dialog },
  props: {
  },
  data () {
    return {
      device: {
      },
      scene: {
        screen: '4:3',
        elements: []
      },
      dialogVisible: false
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {
    show (elements, ratio) {
      this.scene = {
        screen: ratio,
        elements
      }
      this.device = fitToContainer(ratio, window.innerWidth * 0.9, window.innerHeight * 0.9)
      this.dialogVisible = true

      this.$nextTick(() => {
        this.$refs.play.replay()
      })
    },
    setDevice () {

    },
    close () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss">
#preview-dialog {
  z-index: 99999;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.4);
  display: flex;
  justify-content: center;
  align-items: center;
  .scene {
    overflow: hidden;
  }
}
</style>
