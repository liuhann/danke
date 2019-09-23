<template>
<div class="edit-position field-group">
  <div class="field has-addons">
    <div class="control field-lb" @click="copyPositionStyle">
      位置
    </div>
    <div class="control">
      <div class="select is-small">
        <select v-model="position.horizontal">
          <option v-for="option in horizontalOptions" :value="option.key" :key="option.key">{{option.value}}</option>
        </select>
      </div>
    </div>
    <div class="control">
       <edit-len v-model="position.offsetX"></edit-len>
    </div>
    <div v-if="copied" class="control paste" @click="pastePositionStyle">
      <i class="icon-paste"></i>
    </div>
  </div>
  <div class="field has-addons">
    <div class="control field-lb">
    </div>
    <div class="control">
      <div class="select is-small">
        <select v-model="position.vertical">
          <option v-for="option in verticalOptions" :value="option.key" :key="option.key">{{option.value}}</option>
        </select>
      </div>
    </div>
    <div class="control">
       <edit-len v-model="position.offsetY"></edit-len>
    </div>
  </div>
</div>
</template>

<script>
import EditLen from './EditLen'
import SVG_HOR from '../../svg/position-x.svg'
import SVG_VER from '../../svg/position-y.svg'
import FormField from './FormField'
import { horizontalOptions, verticalOptions } from '../../../danke-core/css-model/position'
export default {
  name: 'EditPosition',
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
      SVG_HOR,
      SVG_VER,
      horizontalOptions,
      verticalOptions
    }
  },
  computed: {
    position () {
      return this.value
    }
  },
  created () {
    if (this.ctx.positionCopied) {
      this.copied = this.ctx.positionCopied
    }
  },
  methods: {
    pastePositionStyle () {
      if (this.copied) {
        this.position.horizontal = this.copied.position.horizontal
        this.position.offsetX = this.copied.position.offsetX
        this.position.vertical = this.copied.position.vertical
        this.position.offsetY = this.copied.position.offsetY
      }
    },
    copyPositionStyle () {
      if (this.ctx.positionCopied) {
        this.ctx.positionCopied = null
        this.copied = null
      } else {
        this.copied = {
          position: JSON.parse(JSON.stringify(this.position))
        }
        this.ctx.positionCopied = this.copied
      }
    }
  }
}
</script>

<style lang="scss">
.edit-position {
}

</style>
