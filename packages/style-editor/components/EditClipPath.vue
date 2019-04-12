<template>
  <div class="edit-clip-path">
    <item-block title="裁切类型">
      <el-select v-model="clip.type" @change="clipTypeChange" size="mini" :style="{width: '120px'}">
        <el-option value="none" label="无裁切"></el-option>
        <el-option value="polygon" label="多边形"></el-option>
        <el-option value="ellipse" label="椭圆"></el-option>
      </el-select>
    </item-block>

    <div class="clip-polygon">
      <item-block :title="`点${(index+1)}`" v-for="(point, index) of clip.points" :key="index" :label-width="60">
        <el-input-number size="mini" v-model="point[0]" :style="{marginRight: '5px'}" :step="5"></el-input-number>
        <el-input-number size="mini" v-model="point[1]" :style="{marginRight: '5px'}" :step="5"></el-input-number>
        <el-button type="text" icon="el-icon-delete" @click="removePoint(index)"></el-button>
      </item-block>
      <el-button icon="el-icon-plus" type="text" v-if="clip.type !== 'none'" @click="addPoint">增加</el-button>
    </div>
  </div>
</template>

<script>
import ItemBlock from './ItemBlock'
export default {
  name: 'EditClipPath',
  components: { ItemBlock },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      clip: this.value
    }
  },
  created () {},
  watch: {
    value () {
      this.clip = this.value
    },

    clip: {
      handler: function (val, oldVal) {
        this.$emit('input', this.clip)
      },
      deep: true
    }
  },
  methods: {
    clipTypeChange () {
      if (this.clip.type === 'polygon') {
        this.$set(this.clip, 'points', [[0, 0], [100, 0], [100, 100], [0, 100]])
        // this.clip.points =
      } else if (this.clip.type === 'ellipse') {
        this.$set(this.clip, 'points', [[50, 50], [50, 50]])
      } else {
        this.$set(this.clip, 'points', [])
      }
    },

    removePoint (index) {
      this.clip.points.splice(index, 1)
    },

    addPoint () {
      this.clip.points.push([50, 50])
    }
  }
}
</script>

<style lang="scss">
.edit-clip-path {
  .van-stepper {
    float: left;
    margin-right: 5px;
  }
}
</style>
