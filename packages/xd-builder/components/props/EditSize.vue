<template>
<div class="field has-addons">
  <p class="control field-lb" @click="copySizeStyle">
    宽高
  </p>
  <p class="control">
    <input class="input is-small" type="number" style="width: 55px;" v-model="size.width">
  </p>
  <p class="control">
    <span class="select is-small">
      <select v-model="size.wu" class="is-small">
        <option v-for="u of units" :key="u.value" :value="u.value" :label="u.label">{{u.label}}</option>
      </select>
    </span>
  </p>
  <p class="control">
    <input class="input is-small" type="number" style="width: 55px;" v-model="size.height">
  </p>
  <p class="control">
    <span class="select is-small">
      <select v-model="size.hu" class="is-small">
        <option v-for="u of units" :key="u.value" :value="u.value" :label="u.label">{{u.label}}</option>
      </select>
    </span>
  </p>
  <div v-if="copied" class="control paste" @click="pasteSizeStyle">
    <i class="icon-paste"></i>
  </div>
</div>
</template>

<script>
import EditLen from './EditLen.vue'
import { getLenSplits } from '../../../danke-core/utils/styles'
import { lenUnit } from '../../../danke-core/utils/css-options'
import FormField from './FormField.vue'
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
      copied: null,
      size: {
        width: 0,
        wu: 'px',
        height: 0,
        hu: 'px'
      },
      oldSize: {},
      units: lenUnit
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
    this.setSize()
    if (this.ctx.sizeCopied) {
      this.copied = this.ctx.sizeCopied
    }
  },
  watch: {
    'value.width': function () {
      this.setSize()
    },
    size: {
      deep: true,
      handler () {
        this.emitValue()
      }
    }
  },

  methods: {
    emitValue () {
      this.$emit('input', {
        width: this.size.width + this.size.wu,
        height: this.size.height + this.size.hu
      })
    },
    setSize () {
      const wsp = getLenSplits(this.value.width)
      const hsp = getLenSplits(this.value.height)
      this.size.width = wsp.len
      this.size.wu = wsp.unit
      this.size.height = hsp.len
      this.size.hu = hsp.unit
    },

    pasteSizeStyle () {
      if (this.copied) {
        this.size.width = this.copied.size.width
        this.size.wu = this.copied.size.wu
        this.size.height = this.copied.size.height
        this.size.hu = this.copied.size.hu
      }
    },

    copySizeStyle () {
      if (this.ctx.sizeCopied) {
        this.ctx.sizeCopied = null
        this.copied = null
      } else {
        this.copied = {
          size: JSON.parse(JSON.stringify(this.size))
        }
        this.ctx.sizeCopied = this.copied
      }
    }
  }
}
</script>

<style lang="scss">
.edit-size {

}
</style>
