<template>
<div class="field is-horizontal edit-size">
  <div class="field-label is-small">
    <label class="label">大小</label>
  </div>
  <div class="field-body">
    <div class="field has-addons">
      <p class="control">
        <input class="input is-small" style="width: 55px;" type="number" v-model.number="size.width">
      </p>
      <p class="control">
        <span class="select is-small">
          <select v-model="size.wu" class="is-small">
            <option v-for="u of units" :key="u.value" :value="u.value" :label="u.label">{{u.label}}</option>
          </select>
        </span>
      </p>
    </div>
    <div class="field">
      <p class="control">
        <a v-if="ratio > 0" class="icon-link has-text-success" @click="ratio = -1"></a>
        <a v-if="ratio < 0" class="icon-unlink" @click="ratio = this.size.width / this.size.height"></a>
      </p>
    </div>
    <div class="field has-addons">
      <p class="control">
        <input class="input is-small" style="width: 55px;" type="number" v-model.number="size.height">
      </p>
      <p class="control">
        <span class="select is-small">
          <select v-model="size.hu" class="is-small">
            <option v-for="u of units" :key="u.value" :value="u.value" :label="u.label">{{u.label}}</option>
          </select>
        </span>
      </p>
    </div>
  </div>
</div></template>

<script>
import EditLen from './EditLen.vue'
import { getLenSplits } from '../../danke-core/utils/styles'
import { lenUnit } from '../../danke-core/utils/css-options'
import FormField from '../../common/FormField.vue'
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
      size: {
        width: 0,
        wu: 'px',
        height: 0,
        hu: 'px'
      },
      oldSize: {},
      ratio: -1,
      units: lenUnit,
      relatedIndex: -1,
      customRatio: ''
    }
  },
  computed: {
    fixedRatio () {
      const wsp = getLenSplits(this.value.width)
      const hsp = getLenSplits(this.value.height)
      if (wsp.unit === hsp.unit) {
        return wsp.len / hsp.len
      } else {
        return -1
      }
    },
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
    this.setSize()
  },
  watch: {
    value () {
      this.setSize()
    },
    'size.width': function () {
      if (this.ratio > 0) {
        this.size.height = Math.floor(this.size.width / this.ratio)
      }
      this.emitValue()
    },
    'size.height': function () {
      if (this.ratio > 0) {
        this.size.width = Math.floor(this.size.height * this.ratio)
      }
      this.emitValue()
    },
    'size.wu': function () {
      if (this.ratio > 0) {
        this.size.hu = this.size.wu
      }
      this.emitValue()
    },
    'size.hu': function () {
      if (this.ratio > 0) {
        this.size.wu = this.size.hu
      }
      this.emitValue()
    },
    'ratio': function () {
      this.emitValue()
    }
  },

  methods: {
    emitValue () {
      this.$emit('input', {
        width: this.size.width + this.size.wu,
        height: this.size.height + this.size.hu,
        fix: this.ratio > 0 ? true : false
      })
    },
    setSize () {
      const wsp = getLenSplits(this.value.width)
      const hsp = getLenSplits(this.value.height)
      this.size.width = wsp.len
      this.size.wu = wsp.unit
      this.size.height = hsp.len
      this.size.hu = hsp.unit
      if (this.value.fix) {
        this.ratio = this.size.width / this.size.height
      } else {
        this.ratio = -1
      }
    },
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
  .field-body {
    display: flex;
  }
}
</style>
