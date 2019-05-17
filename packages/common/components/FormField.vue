<template>
  <div class="field is-horizontal">
    <div class="field-label" :class="size" v-if="label">
      <label class="label">{{label}}</label>
    </div>
    <div class="field-body" :class="size">
      <div class="field has-addons">
        <div class="control">
          <div class="select is-small" v-if="isSelect">
            <select v-model="fieldValue">
              <option v-for="option in optionsArray" :value="option.key" :key="option.key">{{option.value}}</option>
            </select>
          </div>
          <input v-if="isInput" class="input" :style="inputWidth" :class="size" :type="type" v-model="fieldValue" :placeholder="placehoder"/>
          <div class="buttons has-addons" v-if="isRadio">
            <span v-for="option in optionsArray" :key="option.key" :class="fieldValue === option.key? 'is-selected is-info': ''" class="button is-small" @click="changeRadioValue(option.key)">{{option.value}}</span>
          </div>
        </div>
        <p class="control" v-if="unit">
          <a class="button is-static" :class="size">
            {{unit}}
          </a>
        </p>
        <p class="control" v-if="isSelect && clearable"><a class="icon-trash-empty"></a></p>
        <p class="control" v-if="hasSlot">
          <slot></slot>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormField',
  props: {
    label: {
      type: String
    },
    clearable: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'is-small'
    },
    unit: {
      type: String
    },
    placehoder: {
      type: String
    },
    value: {
      type: [String, Number]
    },
    type: {
      type: String,
      default: 'text'
    },
    options: {
      type: [Array, Object]
    },
    width: {
      type: String
    }
  },
  data () {
    return {

    }
  },
  computed: {
    optionsArray () {
      if (this.options.length) {
        return this.options
      } else {
        const array = []
        for (let key in this.options) {
          array.push({
            key: this.options[key],
            value: key
          })
        }
        return array
      }
    },
    hasSlot () {
      return this.$slots && this.$slots.default && this.$slots.default.length
    },
    isInput () {
      if (this.hasSlot) return false
      return this.type === 'text' || this.type === 'number'
    },
    isSelect () {
      if (this.hasSlot) return false
      return this.type === 'select'
    },
    isRadio () {
      if (this.hasSlot) return false
      return this.type === 'radio'
    },
    fieldValue: {
      get: function () {
        return this.value
      },
      set: function (newValue) {
        this.$emit('input', newValue)
      }
    },
    inputWidth () {
      if (this.width) {
        return {
          width: this.width
        }
      } else {
          return {}
        }
      }
    },
  methods: {
    changeRadioValue (v) {
      this.fieldValue = v
    }
  }
}
</script>

<style>

</style>
