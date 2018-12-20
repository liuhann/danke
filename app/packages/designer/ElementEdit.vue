<template>
<div class="element-edit">
  <div class="badges">
    <van-badge-group :active-key="activeKey" @change="onBadgeChange($event)">
      <van-badge title="定位" v-if="positionable"/>
      <van-badge title="字体" v-if="fontable"/>
      <van-badge title="背景" v-if="backable"/>
      <van-badge title="裁切" v-if="clipable"/>
      <van-badge title="边框" v-if="borderable"/>
      <van-badge title="进入"/>
      <van-badge title="持续"/>
      <van-badge title="离开"/>
    </van-badge-group>
  </div>
  <div class="edit-area">
    <div v-if="currentTab === '定位'">
      <edit-len v-model="element.x" min="-1000000" label="横向"></edit-len>
      <edit-len v-model="element.y" min="-1000000" label="纵向"></edit-len>
      <edit-len v-model="element.width" label="宽度"></edit-len>
      <edit-len v-model="element.height" label="高度"></edit-len>
    </div>
    <div v-if="currentTab === '字体'">
      <edit-len v-model="element.font.size" label="大小"></edit-len>
    </div>
    <div v-if="currentTab === '裁切'">
      <edit-clip-path v-model="element.clipPath"></edit-clip-path>
    </div>
    <div v-if="currentTab === '进入'">
      <edit-animation v-model="element.in"></edit-animation>
    </div>
    <div v-if="currentTab === '离开'">
      <edit-animation v-model="element.out"></edit-animation>
    </div>
    <div v-if="currentTab === '持续'">
      <edit-animation v-model="element.existence"></edit-animation>
    </div>
    <div v-if="currentTab === '背景'">
    </div>
  </div>
</div>
</template>

<script>
import AnimationSelector from './AnimationSelector'
import EditLen from './EditLen'
import EditClipPath from './EditClipPath'
import EditAnimation from './EditAnimation'

const REG_LEN = /([+-]?[0-9#]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/
export default {
  name: 'ElementEdit',
  components: {
    AnimationSelector,
    EditClipPath,
    EditLen,
    EditAnimation
  },
  props: {
    element: {
      type: Object
    }
  },
  data () {
    return {
      activeKey: 0,
      active: '定位',
      position: {
        x: 0,
        xu: 'vw',
        y: 0,
        yu: 'vh',
        w: 0,
        wu: 'vw',
        h: 0,
        hu: 'vh'
      },
      clip: {
        ax: 0,
        ay: 0,
        bx: 100,
        by: 0,
        cx: 100,
        cy: 100,
        dx: 0,
        dy: 100
      },
      entrance: {
        animation: '',
        duration: 400,
        timing: 'easeOutQuad',
        delay: 0
      },
      exits: {
        animation: '',
        duration: 400,
        delay: 0
      }
    }
  },
  watch: {
    value () {
      // this.setDataFromValue()
    },
    position1: {
      handler: function (val, oldVal) {
        this.value.x = this.position.x + this.position.xu
        this.value.y = this.position.y + this.position.yu
        this.value.width = this.position.w + this.position.wu
        this.value.height = this.position.h + this.position.hu
      },
      deep: true
    },
    clip: {
      handler: function (val, oldVal) {
        this.value.clipPath = `polygon(${this.clip.ax}% ${this.clip.ay}%, ${this.clip.bx}% ${this.clip.by}%, ${this.clip.cx}% ${this.clip.cy}%, ${this.clip.dx}% ${this.clip.dy}%)`
      },
      deep: true
    }
  },

  computed: {
    clipable () {
      return this.element.type === 'image'
    },
    backable () {
      return true
    },
    fontable () {
      return this.element.type === 'text'
    },
    positionable () {
      return this.element.type !== 'scene'
    },
    borderable () {
      return this.element.type !== 'scene'
    }
  },
  created () {
  },

  methods: {
    onBadgeChange (index) {
      this.currentTab = event.currentTarget.innerText
      this.activeKey = index
    }
  }
}
</script>

<style lang="less">
.element-edit {
  height: 28vh;
  display: flex;

  .edit-area {
    flex: 4;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .badges {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    .van-badge {
      padding: 2vw 1vw;
    }
  }
  .van-row {
    height: 7vh;
    box-sizing: border-box;
    line-height: 7vh;
  }
}
</style>
