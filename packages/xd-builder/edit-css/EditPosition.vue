<template>
<div class="edit-position field-group">
  <div class="field has-addons">
    <div class="control field-lb">
      位置
    </div>
    <div class="control" style="width: 70px;">
      <el-select v-model="position.horizontal" size="mini">
        <el-option v-for="option in horizontalOptions" :value="option.key" :key="option.key" :label="option.value" />
      </el-select>
    </div>
    <div class="control">
       <edit-len v-model="position.offsetX"></edit-len>
    </div>
  </div>
  <div class="field has-addons">
    <div class="control field-lb">
    </div>
    <div class="control" style="width: 70px;">
      <el-select v-model="position.vertical" size="mini">
        <el-option v-for="option in verticalOptions" :value="option.key" :key="option.key" :label="option.value" />
      </el-select>
    </div>
    <div class="control">
       <edit-len v-model="position.offsetY"></edit-len>
    </div>
  </div>
</div>
</template>

<script>
import EditLen from '../components/props/EditLen'
import { Select, Option, InputNumber } from 'element-ui'
import { horizontalOptions, verticalOptions } from '../../danke-core/css-model/position'
export default {
  name: 'EditPosition',
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    [InputNumber.name]: InputNumber,
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
