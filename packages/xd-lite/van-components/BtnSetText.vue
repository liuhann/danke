<template>
  <div class="btn-set-text">
    <van-button round icon="font-o" @click="show=true" />
    <van-popup v-model="show" position="bottom" :overlay="false">
      <van-form>
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
    </van-popup>
  </div>
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
.btn-set-text {

}
</style>
