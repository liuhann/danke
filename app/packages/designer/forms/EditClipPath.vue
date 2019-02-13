<template>
<div class="edit-clip-path">
  <van-cell class="group-title" title="裁切" icon="expand-o"/>
  <item-block title="裁切类型">
    <select v-model="clip.type" @change="clipTypeChange">
      <option value="none">无裁切</option>
      <option value="polygon">四角裁切</option>
      <option value="circle">圆形</option>
      <option value="ellipse">椭圆</option>
    </select>
  </item-block>

  <div class="clip-polygon" v-if="clip.type === 'polygon'">
    <item-block title="左上">
      <van-stepper v-model="clip.points[0]" :min="-1000" :max="1000"/>
      <van-stepper v-model="clip.points[1]" :min="-1000" :max="1000"/>
    </item-block>
    <item-block title="右上">
      <van-stepper v-model="clip.points[2]" :min="-1000" :max="1000"/>
      <van-stepper v-model="clip.points[3]" :min="-1000" :max="1000"/>
    </item-block>
    <item-block title="右下">
      <van-stepper v-model="clip.points[4]" :min="-1000" :max="1000"/>
      <van-stepper v-model="clip.points[5]" :min="-1000" :max="1000"/>
    </item-block>
    <item-block title="左下">
      <van-stepper v-model="clip.points[6]" :min="-1000" :max="1000"/>
      <van-stepper v-model="clip.points[7]" :min="-1000" :max="1000"/>
    </item-block>
  </div>

  <div class="clip-polygon" v-if="clip.type === 'circle'">
    <item-block title="半径(%)">
      <van-stepper v-model="clip.points[0]" :min="0" :max="1000"/>
    </item-block>
    <item-block title="圆心(%)">
      <van-stepper v-model="clip.points[1]" :min="-1000" :max="1000"/>
      <van-stepper v-model="clip.points[2]" :min="-1000" :max="1000"/>
    </item-block>
  </div>

  <div class="clip-polygon" v-if="clip.type === 'ellipse'">
    <item-block title="半径(%)">
      <van-stepper v-model="clip.points[0]" :min="0" :max="1000"/>
      <van-stepper v-model="clip.points[1]" :min="0" :max="1000"/>
    </item-block>
    <item-block title="圆心(%)">
      <van-stepper v-model="clip.points[2]" :min="-1000" :max="1000"/>
      <van-stepper v-model="clip.points[3]" :min="-1000" :max="1000"/>
    </item-block>
  </div>


</div>
</template>

<script>
import ItemBlock from './ItemBlock'
export default {
  name: 'EditClipPath',
  components: {ItemBlock},
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
  created () {

  },
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
        this.$set(this.clip, 'points', [0, 0, 100, 0, 100, 100, 0, 100])
        // this.clip.points =
      } else if (this.clip.type === 'circle') {
        this.$set(this.clip, 'points', [50, 50, 50])
      } else if  (this.clip.type === 'ellipse') {
        this.$set(this.clip, 'points', [50, 40, 50, 50])
      } else {
        this.$set(this.clip, 'points', undefined)
      }
    }
  }
}
</script>

<style lang="less">
.edit-clip-path {
  .van-stepper {
    float: left;
    margin-right: 5px;
  }
}
</style>
