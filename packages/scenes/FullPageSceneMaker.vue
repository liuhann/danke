<template>
  <div id="scene-maker">
    <div class="tool-bar">
      <drop-down-menu :menus="addElementType" @menu-clicked="addMenuClicked">
        <span class="button icon-plus-1 is-primary is-small">插入元素</span>
      </drop-down-menu>
      <a class="button is-white is-small"></a>
      <a class="button is-white is-small" @click="zoomIn">
        <i class="icon-minus-1"></i>
      </a>
      <a class="button is-white is-small" >
        {{zoom}}
      </a>
      <a class="button is-white is-small" @click="zoomOut">
        <i class="icon-plus-1"></i>
      </a>
    </div>
    <div class="sider-bar"></div>
    <div class="scene-container" ref="container">
      <div class="device-drag"></div>
      <div class="device" ref="device" :style="deviceStyle">
        <div v-for="element of elements" :key="element.id"
             class="element" :class="[element===currentElement? 'current': '', element.visible?'':'hidden']" :style="element.style"
             @click.self="chooseElement(element)">
          <span @click.self="chooseElement(element)" @input="contentChange" :contenteditable="element===currentElement" v-if="element.type === TypeEnum.TEXT /*&& element!==currentElement*/" v-html="$options.filters.newline(element.text)"></span>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <image-cropper ref="cropper"></image-cropper>
  </div>
</template>

<script>
import interact from 'interactjs'
import { fitToContainer } from '../danke-core/utils/common'
import elementMixin from './mixins/elementMixins'
import DropDownMenu from '../common/components/DropDownMenu'
import ImageCropper from './components/ImageCropper'
import { TypeEnum } from '../danke-core/elements/index'
export default {
  name: 'FullPageSceneMaker',
  components: { ImageCropper, DropDownMenu },
  mixins: [ elementMixin ],
  props: {
    ratio: {
      type: String,
      default: '9:16'
    }
  },
  data () {
    return {
      TypeEnum,
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
    interact('.device-drag').draggable({
      onmove: this.dragMoveListener
    }).styleCursor(false)
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
      this.zoom = 1
      this.device = fitToContainer(this.ratio, containerEl.clientWidth, containerEl.clientHeight - 40)
    },
    dragMoveListener (event) {
      let target = event.target
      console.log(target)
      target = target.parentElement
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
      // translate the element
      this.$refs.device.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

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
        z-index: 10;
        .element {
          position: absolute;
          &.current {
            outline: 2px dashed #87b1f1;
            outline-offset: 0;
            z-index: 9999;
          }
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
