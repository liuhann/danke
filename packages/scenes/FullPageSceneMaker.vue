<template>
  <div id="scene-maker">
    <div class="tool-bar">
      增加
      <a class="button is-white is-small">图片</a>
      <a class="button is-white is-small"></a>
      <a class="button is-white is-small">White</a>
      <a class="button is-white is-small" @click="zoomIn">
        <i class="icon-plus"></i>
      </a>
      <a class="button is-white is-small" >
        {{zoom}}
      </a>
      <a class="button is-white is-small" @click="zoomOut">
        <i class="icon-minus"></i>
      </a>
    </div>
    <div class="v-tool-bar">

    </div>
    <div class="sider-bar"></div>
    <div class="scene-container" ref="container">
      <div class="device draggable-source" ref="device" :style="deviceStyle">
        <div class="ti"></div>
      </div>
    </div>
    <div class="line"></div>
  </div>
</template>

<script>
import interact from 'interactjs'
import { fitToContainer } from '../danke-core/utils/common'
export default {
  name: 'FullPageSceneMaker',
  props: {
    ratio: {
      type: String,
      default: '9:16'
    }
  },
  data () {
    return {
      device: {
        width: 360,
        height: 640
      },
      zoom: 1,
      position: {
        left: 0,
        top: 0
      }
    }
  },
  computed: {
    deviceStyle () {
      return {
        width: this.device.width * this.zoom + 'px',
        height: this.device.height * this.zoom + 'px'
      }
    }
  },
  mounted () {
    this.autoZoomFitContainer()
    /*interact('.ti')
      .draggable({
        // keep the element within the area of it's parent
        // modifiers: [
        //   interact.modifiers.restrict({
        //     restriction: 'parent',
        //     endOnly: true,
        //     elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        //   })
        // ],
        // call this function on every dragmove event
        onmove: this.dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
        }
      })*/
    interact('.ti').draggable({
      onmove: this.dragMoveListener
    })
  },
  methods: {
    zoomIn () {
      this.zoom = Math.floor((this.zoom - 0.1) * 10) / 10
    },
    zoomOut () {
      this.zoom = Math.floor((this.zoom + 0.1) * 10) / 10
    },
    autoZoomFitContainer () {
      const containerEl = this.$refs.container
      this.device = fitToContainer(this.ratio, containerEl.clientWidth, containerEl.clientHeight - 40)
    },
    dragMoveListener (event) {
      let target = event.target
      console.log(target)
      target = target.parentElement
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
      // translate the element
      target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)'

      // update the posiion attributes
      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)
    }
  }
}
</script>

<style lang="scss">
  html.has-navbar-fixed-top, body.has-navbar-fixed-top {
    padding-top: 0;
  }

  #scene-maker {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #f5f5f4;
    .tool-bar {
      font-size: 0.75rem;
      height: 2.25em;
      line-height: 2.25em;
      background-color: #fff;
    }
    .scene-container {
      position: absolute;
      left: 0;
      font-size: 0.75rem;
      top: 2.5em;
      bottom: 0;
      right: 0;

      .device-drag {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 1;
      }

      .device {
        touch-action: none;
        position: absolute;
        left: 20px;
        background-color: #fff;
        z-index: 100;
        .element {
          position: absolute;
          background-color: #0a0a0a;
          width: 30px;
          height: 30px;
        }
        .ti {
          position: absolute;
          background-color: #0a0a0a;
          left: -30px;
          width: 30px;
          height: 30px;
        }
      }
    }
  }

  .line {
    margin: 5px 0;
    height: 4px;
    background: repeating-linear-gradient(to right, red 0, red 5px, transparent 5px, transparent 7px);
    /*5px red then 2px transparent -> repeat this!*/
    background-size: 100% 1px;
    background-repeat: no-repeat;
  }
</style>
