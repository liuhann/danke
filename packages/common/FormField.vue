<template>
  <div class="field is-horizontal">
    <div class="field-label" :class="size" v-if="label">
      <label class="label">{{label}}</label>
    </div>
    <div class="field-body" :class="size">
      <div class="field has-addons">
        <p class="control">
          <div class="select is-small" v-if="isSelect">
            <select v-model="fieldValue" @change="selectChange">
              <option v-for="option in optionsArray" :value="option.key" :key="option.key">{{option.value}}</option>
            </select>
          </div>
          <input v-if="isInput" class="input" :style="inputWidth" :class="size" :type="type" v-model="fieldValue" :placeholder="placehoder">
        </p>
        <p class="control" v-if="unit">
          <a class="button is-static" :class="size">
            {{unit}}
          </a>
        </p>
        <p class="control" v-if="$slots.default">
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
    isInput () {
      return this.type === 'text' || this.type === 'number'
    },
    isSelect () {
      return this.type === 'select'
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
    }
}
</script>

<style scoped>

</style>
