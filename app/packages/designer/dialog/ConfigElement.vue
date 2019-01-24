<template>
<div class="element-edit">
  <van-nav-bar title="元素配置" @click-left="close" left-text="关闭">
    <van-button size="small" plain type="danger" class="btn-delete" @click="removeElement" slot="right">删除</van-button>
  </van-nav-bar>
  <van-tabs v-model="activeKey">
    <van-tab title="定位与大小">
      <van-cell title="位置" icon="aim" />
      <edit-position v-model="element.position"></edit-position>
      <van-cell class="group-title" title="大小" icon="expand-o" />
      <div class="group">
        <edit-len label="宽度" v-model="element.position.width"></edit-len>
        <edit-len label="高度" v-model="element.position.height"></edit-len>
      </div>
    </van-tab>
    <van-tab title="显示样式">
      <edit-font v-model="element.font" v-if="fontable"></edit-font>
      <edit-background v-model="element.background"></edit-background>
      <van-cell class="group-title" title="边框" icon="expand-o" v-if="borderable"/>
      <edit-border v-model="element.border" v-if="borderable"></edit-border>
      <van-cell class="group-title" title="裁切" icon="expand-o" v-if="clipable"/>
      <edit-clip-path v-model="element.clip" v-if="clipable"></edit-clip-path>
    </van-tab>
    <van-tab title="动画效果">
      <van-cell class="group-title" title="进入" icon="expand-o" />
      <edit-animation v-model="element.in" :type="['entrance', 'attention', element.type==='text'?'text': undefined]"></edit-animation>
      <van-cell class="group-title" title="持续" icon="expand-o" />
      <edit-animation v-model="element.existence" :type="['attention']"></edit-animation>
      <van-cell class="group-title" title="离开" icon="expand-o" />
      <edit-animation v-model="element.out" :type="['outs']"></edit-animation>
    </van-tab>
  </van-tabs>
</div>
</template>

<script>
import AnimationSelector from '../forms/AnimationSelector'
import EditBackground from '../forms/EditBackground'
import EditLen from '../forms/EditLen'
import EditClipPath from '../forms/EditClipPath'
import EditAnimation from '../forms/EditAnimation'
import EditBorder from '../forms/EditBorder'
import EditPosition from '../forms/EditPosition'
import EditFont from '../forms/EditFont'

export default {
  name: 'ConfigElement',
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
    editElement: {
      type: Object
    }
  },
  data () {
    return {
      element: this.editElement,
      activeKey: 0,
    }
  },
  watch: {
    'editElement': function (val) {
      this.element = this.editElement
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
    close () {
      this.$emit('close')
    },
    removeElement () {
      this.$emit('element-remove')
    }
  }
}
</script>

<style lang="less">
.element-edit {
  .panel-content {
    height: 30vw;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #efefef;
    .preview-square {
      box-sizing: border-box;
      width: 35vw;
      height: 25vw;
    }
  }
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
