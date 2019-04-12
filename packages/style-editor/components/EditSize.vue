<template>
<div class="edit-size">
  <edit-len label="宽度" v-model="value.width" :min="1" @step-change="widthChanged"></edit-len>
  <item-block title="锁定比例">
    <el-button-group size="mini">
      <el-button v-for="(relate, index) of relates"
                 :class="index === relatedIndex ? 'current': ''"
                 @click="chooseIndex(index)"
                 size="mini"
                 :key="index"
                 :icon="relate.icon"
                 round>{{relate.value}}</el-button>
    </el-button-group>
  </item-block>
  <edit-len label="高度" v-model="value.height" :min="1" @step-change="heightChanged"></edit-len>
</div>
</template>

<script>
import EditLen from './EditLen'
import ItemBlock from './ItemBlock'
import { getLenSplits } from '../utils/styles'
export default {
  name: 'EditSize',
  components: {
    ItemBlock,
    EditLen
  },
  props: {
    value: {
      type: Object
    },
    device: {
      type: Object
    }
  },
  data () {
    return {
      relatedIndex: -1,
      customRatio: 1
    }
  },
  computed: {
    relates () {
      return [{
        icon: 'el-icon-sort',
        value: ''
      }, {
        value: '4:3',
        ratio: 4 / 3
      }, {
        value: '3:2',
        ratio: 3 / 2
      }, {
        value: '2:1',
        ratio: 2 / 1
      }]
    }
  },
  created () {

  },
  methods: {
    widthChanged () {
      if (this.relatedIndex > -1) {
        this.value.height = Math.round(getLenSplits(this.value.width).len / this.customRatio) + getLenSplits(this.value.height).unit
      }
    },

    heightChanged () {
      if (this.relatedIndex > -1) {
        this.value.width = Math.round(getLenSplits(this.value.height).len * this.customRatio) + getLenSplits(this.value.width).unit
      }
    },

    chooseIndex (index) {
      if (this.relatedIndex === index) {
        this.relatedIndex = -1
        this.customRatio = 1
      } else {
        this.relatedIndex = index
        const relate = this.relates[this.relatedIndex]
        // 计算新的比例
        if (relate.ratio) {
          this.customRatio = relate.ratio
          this.widthChanged()
        } else {
          this.customRatio = getLenSplits(this.value.width).len / getLenSplits(this.value.height).len
        }
      }
    }
  }
}
</script>

<style lang="scss">
.edit-size {
  .el-button-group {
    .current {
      background: #333;
      color: #fff;
    }
  }
}
</style>
