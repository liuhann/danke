<template>
  <van-popover v-model="show" trigger="click" :placement="placement">
    <van-form :label-width="32" label-align="right" :style="{width: '80vw'}">
      <van-field label="字号">
        <template #input>
          <van-slider v-model="fontSizeVariable.value" :step="4" :min="12" :max="200" />
        </template>
      </van-field>
      <van-field label="间距">
        <template #input>
          <van-slider v-model="fontletterSpacingVariable.value" :step="1" :min="0" :max="60" />
        </template>
      </van-field>
      <van-field label="行高">
        <template #input>
          <van-slider v-model="fontlineHeight.value" :step="4" :min="12" :max="200" />
        </template>
      </van-field>
      <van-field label="粗细">
        <template #input>
          <van-slider v-model="fontWeight.value" :step="200" :min="100" :max="900" />
        </template>
      </van-field>
    </van-form>
    <template #reference>
      <slot>
        <van-button round icon="font-o">
        </van-button>
      </slot>
    </template>
  </van-popover>
</template>

<script>
export default {
  name: "BtnSetText",
  props: {
    element: {
      type: Object,
    },
    placement: {
      type: String,
      default: 'right-end'
    }
  },
  data () {
    return {
      show: false
    }
  },
  computed: {
    fontSizeVariable() {
      if (this.element && this.element.variables) {
        return this.element.variables.filter(variable => variable.type === 'fontSize')[0]
      } else {
        return {}
      }
    },
    fontletterSpacingVariable() {
      if (this.element && this.element.variables) {
        return this.element.variables.filter(variable => variable.type === 'letterSpacing')[0]
      } else {
        return {}
      }
    },
    fontlineHeight() {
      if (this.element && this.element.variables) {
        return this.element.variables.filter(variable => variable.type === 'lineHeight')[0]
      } else {
        return {}
      }
    },
    fontWeight() {
      if (this.element && this.element.variables) {
        return this.element.variables.filter(variable => variable.type === 'fontWeight')[0]
      } else {
        return {}
      }
    }

  },
  methods: {
    onChange (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style scoped lang="scss">
.colors {
  width: 260px;
  padding: 10px;
  .picker-color {
    border: 1px solid #eee;
    margin: 2px;
    width: 36px;
    height:36px;
  }
}
</style>
