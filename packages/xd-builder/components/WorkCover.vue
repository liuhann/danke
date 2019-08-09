<template>
  <div class="device cover" :style="scene.style">
    <div v-for="(element) in scene.elements" :key="element.id" class="element" :class="['type' + element.type]"
         :style="element.style">
      <img v-if="element.url" :src="element.url">
      <span v-if="element.type === TypeEnum.TEXT && element.font.size >= textAdjust" v-html="$options.filters.newline(element.text)"></span>
    </div>
  </div>
</template>

<script>
import { TypeEnum } from '../../danke-core/elements'
import { getElementStyle, getSceneStyle } from '../../danke-core/utils/styles'
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
  watch: {
  },
  computed: {
    device () {
      return fitBy(this.ratio, this.width, this.height)
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
      }
      element.style = getElementStyle(element, this.device)
      this.scene.style = getSceneStyle(this.scene, this.device)
    }
  },
  data () {
    return {
      TypeEnum
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
}
</style>
