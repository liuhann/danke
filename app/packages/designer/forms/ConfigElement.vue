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
      <edit-len v-model="element.x" @change="positionChange" :min="-1000000" label="横向"></edit-len>
      <edit-len v-model="element.y" @change="positionChange" :min="-1000000" label="纵向"></edit-len>
      <edit-len v-model="element.width" @change="positionChange"  label="宽度"></edit-len>
      <edit-len v-model="element.height" @change="positionChange" label="高度"></edit-len>
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
      currentTab: '定位'
    }
  },
  watch: {
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
    positionChange () {
      this.nanobus.emit('position-change', this.element)
    },

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
