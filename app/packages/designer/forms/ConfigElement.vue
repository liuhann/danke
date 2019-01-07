<template>
<div class="element-edit">
  <van-panel title="样式和特效预览" class="element-preview">
    <div class="panel-content">
      <div class="preview-square" :style="previewStyle"></div>
    </div>
    <div slot="footer">
      <van-button size="small" type="primary" plain>应用样式模板</van-button>
    </div>
  </van-panel>

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
      <van-cell class="group-title" title="字体" icon="bars" v-if="fontable"/>
      <edit-font v-model="element.font" v-if="fontable"></edit-font>

      <van-cell class="group-title" title="背景" icon="expand-o" />
      <edit-background v-model="element.background"></edit-background>

      <van-cell class="group-title" title="边框" icon="expand-o" v-if="borderable"/>
      <edit-border v-model="element.border" v-if="borderable"></edit-border>

      <van-cell class="group-title" title="裁切" icon="expand-o" v-if="clipable"/>
      <edit-clip-path v-model="element.clip" v-if="clipable"></edit-clip-path>
    </van-tab>
    <van-tab title="动画效果">
      <van-cell class="group-title" title="进入" icon="expand-o" />
      <edit-animation v-model="element.in" type="entrance"></edit-animation>
      <van-cell class="group-title" title="持续" icon="expand-o" />
      <edit-animation v-model="element.existence" type="existence"></edit-animation>
      <van-cell class="group-title" title="离开" icon="expand-o" />
      <edit-animation v-model="element.out" type="out"></edit-animation>
    </van-tab>
  </van-tabs>
  <van-button size="normal" type="danger" class="btn-delete" @click="removeElement">删除</van-button>
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
import styleUtils  from '../../utils/styles'

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
      activeKey: 0,
      previewStyle: ''
    }
  },
  watch: {
    element: {
      handler: function (val, oldVal) {
        this.$emit('element-change', this.element)
        // console.log('ConfigElement -> change ', this.element)
        this.nanobus.emit('element-change', this.element)
        this.previewStyle = styleUtils.getElementStyle(this.element)
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
  .btn-delete {
    margin: 20px;
  }
}
</style>
