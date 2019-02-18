<template>
<div class="element-edit">
  <van-nav-bar title="元素配置" @click-left="close" left-text="关闭">
    <van-button size="small" plain type="danger" class="btn-delete" @click="removeElement" slot="right">删除</van-button>
  </van-nav-bar>
  <van-tabs v-model="activeKey">
    <van-tab title="基础">
      <edit-text v-model="element.content" v-if="element.content != null"></edit-text>
      <edit-font v-model="element.font" v-if="element.font"></edit-font>
      <edit-background v-model="element.background" v-if="element.background"></edit-background>
      <item-block title="层次">
        <van-button size="small">最下</van-button>
        <van-button size="small">上一层</van-button>
        <van-button size="small">下一层</van-button>
        <van-button size="small" @click="swap('top')">最上</van-button>
      </item-block>
    </van-tab>
    <van-tab title="定位与大小">
      <edit-position v-model="element.position" v-if="element.position"></edit-position>
    </van-tab>
    <van-tab title="边框">
      <edit-border v-model="element.border" v-if="element.border"></edit-border>
      <edit-clip-path v-model="element.clip" v-if="clipable"></edit-clip-path>
    </van-tab>
    <van-tab title="动画效果">
      <edit-animation v-model="element.in" title="进入" :type="['entrance', 'attention', element.type==='text'?'text': undefined]"></edit-animation>
      <edit-animation v-model="element.existence" title="持续" :type="['attention']"></edit-animation>
      <edit-animation v-model="element.out" title="离开" :type="['outs']"></edit-animation>
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
import EditText from '../forms/EditText'
import ItemBlock from '../forms/ItemBlock'

export default {
  name: 'ConfigElement',
  components: {
    ItemBlock,
    EditText,
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
    },
    device: {
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
      return this.element.type === 'image'
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
    swap (direction) {
      this.$emit('swap', direction)
    },
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
