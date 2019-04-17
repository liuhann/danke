<template>
<div class="edit-size">
  <edit-len label="宽度" v-model="value.width" :min="1" @step-change="widthChanged"></edit-len>
  <form-field label="锁定比例" type="radio" :options="relates" v-model="customRatio"></form-field>
  <edit-len label="高度" v-model="value.height" :min="1" @step-change="heightChanged"></edit-len>
</div>
</template>

<script>
import EditLen from './EditLen'
import { getLenSplits } from '../utils/styles'
import FormField from '../../common/FormField'
export default {
  name: 'EditSize',
  components: {
    FormField,
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
      customRatio: ''
    }
  },
  computed: {
    relates () {
      return [{
        key: '无',
        value: '无'
      }, {
        key: '3:2',
        value: '3:2'
      }, {
        key: '4:3',
        value: '4:3'
      }, {
        key: '16:9',
        value: '16:9'
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
