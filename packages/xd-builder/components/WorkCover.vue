<template>
  <div class="device cover" :style="scene.style" @mouseover="mouseOn = true" @mouseout="mouseOn = false">
    <div v-for="(element) in scene.elements" :key="element.id" class="element" :class="['type' + element.type]"
         :style="element.style">
      <img v-if="element.url" :src="element.url">
      <span v-if="element.type === TypeEnum.TEXT && element.font.size >= textAdjust" v-html="$options.filters.newline(element.text)"></span>
    </div>
    <div class="hover-mask" :class="mouseOn? 'on': ''">
      <div class="centering">
        <a class="button is-medium is-success">
          <span class="icon">
            <i class="icon-play"></i>
          </span>
        </a>
        <a class="button is-medium is-info" style="margin-left: 20px;">
          <span class="icon">
            <i class="icon-pencil"></i>
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { TypeEnum } from '../../danke-core/elements'
import { getElementStyle, getImageWebUrl, getSceneStyle } from '../../danke-core/utils/styles'
import { fitBy } from '../../danke-core/utils/common'
export default {
  name: 'WorkCover',
  components: {
  },
  props: {
    work: {
      type: Object
    },
    index: {
      type: Number
    },
    width: {
      type: Number
    },
    ratio: {
      type: String
    },
    height: {
      type: Number
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
  },
  computed: {
    device () {
      if (this.height || this.width) {
        return fitBy(this.ratio, this.width, this.height)
      } else {
        return fitBy(this.ratio, this.$el.clientWidth)
      }
    },
    scene () {
      if (this.index) {
        return this.work.scenes[this.index]
      } else {
        return this.work.scenes[0]
      }
    }
  },
  created () {

  },
  async mounted () {
    for (let element of this.scene.elements) {
      if (element.imgPath) {
        element.url = this.ctx.IMG_SERVER + '/' + element.imgPath
        getImageWebUrl(element, this.device, this.ctx.supportWebp)
      }
      element.style = getElementStyle(element, this.device)
      this.scene.style = getSceneStyle(this.scene, this.device)
    }
  },
  methods: {

  }
}
</script>

<style lang="less">
.device.cover {
  position: relative;
  overflow: hidden;
  border: 1px solid #eee;
  box-shadow: 0 0 4px 0px #eee;
  border-radius: 5px;
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

  .hover-mask {
    opacity: 0;
    transition: opacity .2s ease-out;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background-color: #0a0a0a;
    // background-color: rgba(0,0,0, .75);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &.on {
      opacity: .75;
    }
  }
}
</style>
