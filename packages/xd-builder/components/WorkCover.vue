<template>
<div class="work-cover" style="background-color: #fff" :style="scene.style"
     @click="coverClicked"
     @mouseenter="mouseOn = true" @mouseout="mouseOn = false">
  <render-element
    v-for="(element) in scene.elements"
    stage="in"
    :element="element"
    :key="element.id"/>
  <el-button v-if="showPlay" icon="el-icon-video-camera" type="primary" size="mini" circle class="btn-play" @click="play"/>
</div>
</template>

<script>
import { TypeEnum } from '../../danke-core/elements'
import mixinDevice from '../../xd-player/mixinDevice'
import sceneMixins from '../mixins/sceneMixins'
import { getElementStyle, getImageWebUrl, getSceneStyle } from '../../danke-core/utils/styles'
import RenderElement from '../RenderElement'
import { Button } from 'element-ui'
export default {
  name: 'WorkCover',
  components: {
    RenderElement,
    [Button.name]: Button
  },
  mixins: [ mixinDevice, sceneMixins ],
  props: {
    work: {
      type: Object
    },
    showPlay: {
      type: Boolean,
      default: true
    },
    index: {
      type: Number
    },
    enableMask: {
      type: Boolean,
      default: true
    },
    // 字体样式，小于指定数字的字体不进行展示
    textAdjust: {
      type: Number,
      default: 2
    }
  },
  filters: {
    newline (v) {
      return v.replace(/\n/g, '<br>')
    }
  },
  data () {
    return {
      mouseOn: false,
      TypeEnum
    }
  },
  watch: {
    'mouseOn': function () {
      if (this.mouseOn) {
        for (let element of this.scene.elements) {
          element.style = getElementStyle(element, this.device)
          this.scene.style = getSceneStyle(this.scene, this.device)
        }
        setTimeout(() => {
          for (let element of this.scene.elements) {
            element.style = getElementStyle(element, this.device, 'in')
            this.scene.style = getSceneStyle(this.scene, this.device, 'in')
          }
        }, 200)
      }
    }
  },
  computed: {
    scene () {
      if (this.work.cover) {
        return this.work.cover
      } else if (this.index) {
        return this.work.scenes[this.index]
      } else {
        return []
      }
    }
  },
  created () {

  },
  async mounted () {
    this.renderScene(this.scene, 'in')
    for (let element of this.scene.elements) {
      if (element.imgPath) {
        element.url = this.ctx.IMG_SERVER + '/' + element.imgPath
        getImageWebUrl(element, this.device, this.ctx.supportWebp)
      }
      if (element.animations && element.animations.length) {
        for (let animation of element.animations) {
          animation.cssFrame = this.work.cover.frames[animation.name]
        }
      }
      element.style = getElementStyle(element, this.device, 'in')
      this.scene.style = getSceneStyle(this.scene, this.device, 'in')
    }
  },
  methods: {
    coverClicked () {
      this.$emit('click')
    },
    play () {
      this.$emit('play')
    },
    edit () {
      this.$emit('edit')
    },
    shareLink () {
      this.$emit('link')
    }
  }
}
</script>

<style lang="less">
.work-cover {
  position: relative;
  overflow: hidden;
  // border: 1px solid #eee;
  // box-shadow: 0 0 4px 0px #eee;
  // border-radius: 5px;
  .scene {
    position: absolute;
    left: 0;
    top: 0;
  }
  .element {
    position: absolute;
    &.type1 {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &.type2 {
      display: flex;
      align-items: center;
      span {
        width: 100%;
      }
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .btn-play {
    position: absolute;
    right: 5px;
    top: 5px;
    display: none;
  }
  &:hover {
    .btn-play {
      display: block;
    }
  }
  .hover-mask {
    transition: opacity .2s ease-out;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background-color: rgba(0,0,0, .4);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
