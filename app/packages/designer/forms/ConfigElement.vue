<template>
<div class="element-edit">
  <van-cell class="group-title" title="定位" icon="aim" />
  <edit-position v-model="element.position"></edit-position>

  <van-cell title="大小" icon="expand-o" />
  <div class="group">
    <edit-len label="宽度" v-model="element.position.width"></edit-len>
    <edit-len label="高度" v-model="element.position.height"></edit-len>
  </div>

  <van-cell title="字体" icon="bars" v-if="fontable"/>
  <edit-font v-model="element.font" v-if="fontable"></edit-font>

  <van-cell title="背景" icon="expand-o" />
  <edit-background :background="element.background"></edit-background>

  <van-cell title="边框" icon="expand-o" v-if="borderable"/>
  <edit-border v-model="element.border" v-if="borderable"></edit-border>

  <van-cell title="进入特效" icon="expand-o" />
  <edit-animation v-model="element.in" type="in"></edit-animation>
  <van-cell title="持续特效" icon="expand-o" />
  <edit-animation v-model="element.existence" type="existence"></edit-animation>
  <van-cell title="离开特效" icon="expand-o" />
  <edit-animation v-model="element.existence" type="existence"></edit-animation>

  <van-cell title="裁切" icon="expand-o" v-if="clipable"/>
  <edit-clip-path v-model="element.clip" v-if="clipable"></edit-clip-path>


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
    <div v-if="currentTab === '字体'">
      <edit-len v-model="element.font.size" label="大小"></edit-len>
    </div>
    <div v-if="currentTab === '裁切'">
      <edit-clip-path v-model="element.clip"></edit-clip-path>
    </div>
    <div v-if="currentTab === '进入'">
      <edit-animation v-model="element.in" type="in"></edit-animation>
    </div>
    <div v-if="currentTab === '离开'">
      <edit-animation v-model="element.out" type="out"></edit-animation>
    </div>
    <div v-if="currentTab === '持续'">
      <edit-animation v-model="element.existence" type="existence"></edit-animation>
    </div>
    <div v-if="currentTab === '背景'">
      <edit-background :background="element.background"></edit-background>
    </div>
    <div v-if="currentTab === '边框'">
      <edit-border v-model="element.border"></edit-border>
    </div>
  </div>
</div>
</template>

<script>
import AnimationSelector from './AnimationSelector'
import EditBackground from './EditBackground'
import EditLen from './EditLen'
import EditClipPath from './EditClipPath'
import EditAnimation from './EditAnimation'
import EditBorder from './EditBorder'
import EditPosition from './EditPosition'
import EditFont from './EditFont'

export default {
  name: 'ElementEdit',
  components: {
    AnimationSelector,
    EditClipPath,
    EditLen,
    EditAnimation,
    EditBackground,
    EditBorder,
    EditPosition,
    EditFont
  },
  props: {
    element: {
      type: Object
    }
  },
  data () {
    return {
      colorMode: '1',
      activeKey: 0,
      currentTab: '定位'
    }
  },
  watch: {
    element: {
      handler: function (val, oldVal) {
        console.log('ConfigElement -> change ', this.element)
        this.nanobus.emit('element-change', this.element)
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
    },

    selectColor () {
      this.$refs.colorPicker.show()
    },

    onColorPick () {
      this.nanobus.emit('bg-color-change', this.element)
    }
  }
}
</script>

<style lang="less">
.element-edit {
  background-color: #fafafa;

  .group-title {
    margin-top: 8px;
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
  .edit-area {
    flex: 4;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .van-row {
    box-sizing: border-box;
  }
}
</style>
