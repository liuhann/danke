<template>
  <div class="edit-clip-path">
    <form-field v-model="clip.type" label="裁切类型" type="select" :options="clipTypes"></form-field>
    <div class="field is-horizontal" v-for="(point, index) of clip.points" :key="index">
      <div class="field-label is-small">
        <label class="label">{{index+1}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control is-small">
            <input class="input is-small" v-model.number="point[0]" type="number">
          </p>
        </div>
        <div class="field">
          <p class="control is-small">
            <input class="input is-small" v-model.number="point[1]" type="number">
          </p>
        </div>
        <div class="field">
          <p class="control is-small">
            <button>close</button>
          </p>
        </div>
      </div>
    </div>

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
import FormField from '../../common/FormField'
export default {
  name: 'EditClipPath',
  components: {FormField, ItemBlock },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      clipTypes: [{
        key: 'none',
        value: '无'
      }, {
        key: 'polygon',
        value: '多边形'
      }, {
        key: 'ellipse',
        value: '圆'
      }],
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
