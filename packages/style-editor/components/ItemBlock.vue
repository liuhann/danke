<template>
  <div class="config-block">
    <label :style="labelStyle">{{title||label}}</label>
    <div class="content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemBlock',
  props: {
    labelWidth: {
      type: Number,
      default: 70
    },
    inline: {
      type: Boolean,
      default: true
    },
    title: {
      type: String
    },
    label: {
      type: String
    }
  },
  computed: {
    labelStyle () {
      return {
        width: this.labelWidth + 'px',
        float: this.inline ? 'left' : 'initial'
      }
    },
    contentStyle () {
      return {
        marginLeft: this.inline ? (this.labelWidth + 'px') : '0'
      }
    }
  },
  methods: {
    touchStart (e) {
      this.$emit('touch-start', e)
    },

    touchMove (e) {
      this.$emit('touch-move', e)
    }
  }
}
</script>

<style lang="scss">
.config-block {
  height: 40px;
  clear: both;
  label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 12px;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
    color: #7e7e7e;
  }
  .content {
    line-height: 40px;
    position: relative;
    font-size: 14px;
  }
}
</style>
