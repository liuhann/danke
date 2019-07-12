<template>
<div class="animation-selector">
  <van-button size="small" plain type="primary" @click="isShow = true">{{value || '选择'}}</van-button>
  <van-icon v-if="value" name="clear" @click="clear"></van-icon>
  <van-popup v-model="isShow" position="bottom" :overlay="true" get-container="body">
    <van-nav-bar
      title="选择动画"
      left-text="返回"
      right-text="确定"
      @click-left="onCancel"
      @click-right="onConfirm"
    />
    <div class="animation-preview">
      <div class="square" :style="animationPreviewStyle"></div>
    </div>
    <van-picker :columns="columns" @change="onChange" />
  </van-popup>
</div>
</template>

<script>
import names from '../../animations/names'
export default {
  name: 'AnimationSelector',
  props: {
    type: {
      type: Array,
      default: ['entrance']
    },
    value: {
      type: String
    }
  },
  data () {
    const defaultSetting = names['entrance']
    return {
      isShow: false,
      source: defaultSetting,
      animationClass: '',
      columns: [],
      choosedValues: []
    }
  },

  created () {
    let firstColumn = []
    for (let k of this.type) {
      if (k) {
        firstColumn = firstColumn.concat(names[k])
      }
    }
    this.columns = [{
      values: firstColumn,
      className: 'column1',
      defaultIndex: 2
    }, {
      values: names.getSubAnimations(firstColumn[0]),
      className: 'column2',
      defaultIndex: 2
    }]
  },

  computed: {
    animationPreviewStyle () {
      if (this.choosedValues[1]) {
        return {
          animation: this.choosedValues[1] + ' 0.8s ease-in-out 0s 1 normal both running'
        }
      } else {
        return  {}
      }
    },
  },

  methods: {
    onChange (picker, values) {
      const subs = names.getSubAnimations(values[0])
      picker.setColumnValues(1, subs)
      if (!values[1]) {
        values[1] = subs[1]
        picker.setColumnIndex(1, 1)
      }
      this.choosedValues = values
    },
    onConfirm () {
      this.isShow = false
      if (this.choosedValues && this.choosedValues.length == 2) {
        this.$emit('input', this.choosedValues[1])
      }
    },

    clear () {
      this.$emit('input', '')
    },
    onCancel () {
      this.isShow = false
    }
  }
}
</script>

<style lang="less">
.animation-selector {
  .van-icon-clear {
    line-height: 20px;
    margin-left: 6px;
    color: #07c160;
  }
}
.animation-preview {
  height: 40vw;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  .square {
    background-color: #3e3e3e;
    width: 20vw;
    height: 20vw;
    overflow: hidden;
    box-sizing: border-box;
  }
}
</style>
