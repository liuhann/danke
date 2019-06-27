<template>
  <div id="scene-maker">
    <div class="tool-bar is-clearfix">
      <div style="float: left">
        <a class="button is-white icon-menu"></a>
      </div>
      <div style="float: right;">
        <a class="button is-white" @click="zoomIn">
          <i class="icon-minus-1"></i>
        </a>
        <a class="button is-white">
          {{zoom}}
        </a>
        <a class="button is-white" @click="zoomOut">
          <i class="icon-plus-1"></i>
        </a>
        <a class="button is-white">
          <i class="icon-right-dir" @click="runPreview"></i>
        </a>
        <a class="button is-success is-rounded is-small button-share">发布并分享</a>
      </div>
    </div>
    <div class="element-bar">
      <div class="top">
        <a class="file">
          <label class="file-label">
            <input class="file-input" type="file" name="resume" @input="fileChoosed">
            <span class="button is-white icon-picture-1">
            </span>
          </label>
        </a>
        <a class="button is-white icon-check-empty-1" @click="insertShape('rect')"></a>
        <a class="button is-white icon-circle-thin" @click="insertShape('circle')"></a>
        <a class="button is-white icon-sort-alphabet" @click="insertText"></a>
      </div>
      <div class="bottom">
        <a class="button is-white icon-check-empty-1" @click="showElementsLayer = !showElementsLayer"></a>
      </div>
    </div>
    <div class="scene-container" ref="container">
      <div class="device-drag" ref="deviceDrag"></div>
      <div class="device" ref="device" :style="deviceStyle" @click.self="sceneClick">
        <div v-for="element of elements" :key="element.id" :id="'element-' + element.id"
             class="element" :class="[element.visible?'':'hidden']" :style="element.style"
             @click="chooseElement(element)">
          <span v-if="element.type === TypeEnum.TEXT && element!==currentElement" v-html="$options.filters.newline(element.text)"></span>
          <div class="mask" v-if="element===currentElement">
            <span @input="contentChange" contenteditable v-if="element.type === TypeEnum.TEXT" v-html="$options.filters.newline(element.text)"></span>
            <div class="corner-rb"></div>
          </div>
        </div>
      </div>
    </div>
    <nav class="panel element-prop-config is-small" v-if="currentElement">
      <p class="panel-heading">
        元素配置
      </p>
      <div class="panel-block">
        <prop-config :element="currentElement"></prop-config>
      </div>
    </nav>
    <element-list-config v-show="showElementsLayer" :elements="elements" @choose="chooseElement" @ordered="resetOrder"></element-list-config>
    <image-cropper ref="cropper"></image-cropper>
  </div>
</template>

<script>
import { fitToContainer } from '../danke-core/utils/common'
import elementMixin from './mixins/elementMixins'
import { intereactWith } from './mixins/interact'
import { TypeEnum } from '../danke-core/elements/index'
import ImageCropper from './components/ImageCropper.vue'
import DropDownMenu from '../common/components/DropDownMenu.vue'
import PropConfig from './tabs/PropConfig'
import ElementListConfig from './tabs/ElementListConfig'
export default {
  name: 'FullPageSceneMaker',
  components: { ElementListConfig, PropConfig, ImageCropper, DropDownMenu },
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
      deviceOrigin: {
        width: 360,
        height: 640
      },
      zoom: 1,
      showElementsLayer: false
    }
  },
  computed: {
    device () {
      return {
        width: this.deviceOrigin.width * this.zoom,
        height: this.deviceOrigin.height * this.zoom
      }
    },
    deviceStyle () {
      return {
        width: this.device.width + 'px',
        height: this.device.height + 'px'
      }
    }
  },
  mounted () {
    this.zoomCenter()
    intereactWith(this.$refs.deviceDrag, this.$refs.device)
  },
  methods: {
    zoomIn () {
      this.zoom = Math.floor((this.zoom - 0.1) * 10) / 10
      this.reflow()
    },
    zoomOut () {
      this.zoom = Math.floor((this.zoom + 0.1) * 10) / 10
      this.reflow()
    },
    zoomCenter () {
      const containerEl = this.$refs.container
      const paddings = [20, 20]
      this.zoom = 1
      this.deviceOrigin = fitToContainer(this.ratio, containerEl.clientWidth - paddings[0] * 2, containerEl.clientHeight - paddings[1] * 2)
      this.$nextTick(() => {
        let x = (containerEl.clientWidth - paddings[0] * 2 - this.deviceOrigin.width) / 2
        let y = paddings[1]
        this.$refs.device.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
      })
    },
    sceneClick () {
      this.chooseElement(null)
    },
    resetOrder (elements) {
      console.log('reordered')
      this.elements = elements
    },
    runPreview () {
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
      background-color: #fff;
      .button-share {
        margin: .25em 1em;
      }
    }
    .element-bar {
      position: absolute;
      z-index: 101;
      top: 2.5em;
      left: 0;
      bottom: 0;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content:space-between;
      .top, .bottom {
        display: flex;
        flex-direction: column;
      }
    }
    .element-prop-config, .element-list-config {
      position: absolute;
      z-index: 11;
      top: 2.5em;
      background-color: #fff;
      width: 320px;
    }
    .element-prop-config {
      right: 0;
    }
    .element-list-config {
      left: 3.2em;
      width: 280px;
      bottom: 0;
    }
    .scene-container {
      position: absolute;
      left: 0;
      font-size: 0.75rem;
      top: 3em;
      bottom: 0;
      right: 0;
      overflow: hidden;
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
          .mask {
            position: absolute;
            left: -2px;
            top: -2px;
            width: calc(100% + 4px);
            height: calc(100% + 4px);
            border: 1px solid #87b1f1;
            box-sizing: content-box;
            span {
              outline:none;
            }
            .corner-rb {
              background-color: #87b1f1;
              position: absolute;
              right: -6px;
              bottom: -6px;
              width: 12px;
              height: 12px;
            }
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
