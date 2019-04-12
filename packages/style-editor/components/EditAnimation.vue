<template>
<div class="edit-animation-option">
  {{label}}
  <item-block label="动画">
    <el-select size="mini" v-model="animation.name" placeholder="请选择" clearable>
      <el-option
        v-for="(value, index) in animations"
        :key="index"
        :label="value.name"
        :value="value.name">
      </el-option>
    </el-select>
  </item-block>

  <edit-len label="时长" v-model="animation.duration" :with-unit="false"></edit-len>
  <item-block label="曲线">
    <el-select size="mini" v-model="animation.timing" placeholder="请选择">
      <el-option
        v-for="(value, key) in cubicBeziers"
        :key="key"
        :label="key"
        :value="value">
      </el-option>
    </el-select>
  </item-block>
  <edit-len label="延迟" v-model="animation.delay" :with-unit="false"></edit-len>
  <edit-len label="次数" v-model="animation.iteration" :with-unit="false">
    <el-checkbox v-model="animation.infinite">循环</el-checkbox>
  </edit-len>
</div>
</template>

<script>
import EditLen from './EditLen'
import ItemBlock from './ItemBlock'
import cubicBeziers from '../model/cubic-beziers'
export default {
  name: 'EditAnimation',
  components: {
    ItemBlock,
    EditLen
  },
  props: {
    label: {
      type: String
    },
    animation: {
      type: Object
    },
    value: {
      type: Object
    },
    animations: {
      type: Array
    }
  },
  data () {
    return {
      cubicBeziers
    }
  },
  computed: {
    font () {
      return this.value
    }
  },

  watch: {
    font () {
      this.$emit('input', this.font)
    }
  },
  methods: {

  }
}
</script>

<style>

</style>
