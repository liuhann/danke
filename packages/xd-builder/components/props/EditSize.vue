<template>
<div class="edit-size">
  <div class="field has-addons">
    <p class="control field-lb">
      宽度
    </p>
    <p class="control">
      <edit-len v-model="value.width"></edit-len>
    </p>
  </div>
  <div class="field has-addons">
    <p class="control field-lb">
      高度
    </p>
    <p class="control">
      <edit-len v-model="value.height"></edit-len>
    </p>
  </div>
</div>

</template>

<script>
import EditLen from './EditLen.vue'
export default {
  name: 'EditSize',
  components: {
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
  watch: {
  },
  methods: {
    // emitValue () {
    //   this.$emit('input', {
    //     width: this.size.width + this.size.wu,
    //     height: this.size.height + this.size.hu
    //   })
    // },
    // setSize () {
    //   const wsp = getLenSplits(this.value.width)
    //   const hsp = getLenSplits(this.value.height)
    //   this.size.width = wsp.len
    //   this.size.wu = wsp.unit
    //   this.size.height = hsp.len
    //   this.size.hu = hsp.unit
    // },
    //
    // pasteSizeStyle () {
    //   if (this.copied) {
    //     this.size.width = this.copied.size.width
    //     this.size.wu = this.copied.size.wu
    //     this.size.height = this.copied.size.height
    //     this.size.hu = this.copied.size.hu
    //   }
    // },
    //
    // copySizeStyle () {
    //   if (this.ctx.sizeCopied) {
    //     this.ctx.sizeCopied = null
    //     this.copied = null
    //   } else {
    //     this.copied = {
    //       size: JSON.parse(JSON.stringify(this.size))
    //     }
    //     this.ctx.sizeCopied = this.copied
    //   }
  }
}
</script>

<style lang="scss">
.edit-size {

}
</style>
