<template>
<el-popover
  placement="bottom-start"
  width="320"
  title="扭曲与旋转"
  @show="showPop"
  trigger="click">
  <a class="action" slot="reference">
    <img :src="ICON">
  </a>
  <el-form label-width="140px" size="mini" >
    <el-form-item >
      <el-button slot="label" @click="addTransform" size="mini">增加</el-button>
    </el-form-item>
    <el-form-item v-for="(transform, index) of transforms" :key="index">
      <el-select v-model="transform.key" slot="label" @change="updateTransform">
        <el-option v-for="transformKey in transformKeys" :key="transformKey.value" :label="transformKey.label" :value="transformKey.value" />
      </el-select>
      <el-input-number v-model.number="transform.value" size="mini" controls-position="right" @change="updateTransform"/>°
      <el-button type="text" icon="el-icon-delete" @click="removeTransform(index)" size="mini"/>
    </el-form-item>
  </el-form>
</el-popover>
</template>

<script>
import toolbarPopMixin from './toolbarPopMixin'
import ICON from './res/rotate.svg'
export const transformKeys = [{
  label: '横向扭曲',
  value: 'skewX'
}, {
  label: '纵向扭曲',
  value: 'skewY'
}, {
  label: '旋转',
  value: 'rotateZ'
}, {
  label: 'X旋转',
  value: 'rotateX'
}, {
  label: 'Y旋转',
  value: 'rotateY'
}]
export default {
  name: 'PopTransform',
  mixins: [toolbarPopMixin],
  components: {
  },
  data () {
    return {
      transforms: [],
      transformKeys,
      ICON
    }
  },
  methods: {
    addTransform () {
      this.transforms.push({
        key: 'rotateZ',
        value: 15
      })
      this.updateTransform()
    },
    removeTransform (index) {
      this.transforms.splice(index, 1)
      this.updateTransform()
    },

    updateTransform () {
      this.$set(this.element.style, 'transform', this.arrayToTransform())
    },

    showPop () {
      this.transforms = this.transformToArray(this.element.style.transform)
    },

    // transformToArray的反向方法
    arrayToTransform () {
      return this.transforms.map(transform => `${transform.key}(${transform.value}deg)`).join(' ')
    },

    // rotateZ(20deg) skewY(20deg) => [{rotateZ, 20}, {skewY, 28}]
    transformToArray (transform) {
      if (transform) {
        return transform.split(' ').map(one => {
          const m = /(\w+)\(([\-0-9]+)deg\)/g.exec(one)
          return {
            key: m[1],
            value: parseInt(m[2])
          }
        })
      } else {
        return []
      }
    }
  }
}
</script>

<style scoped>
.el-input-number--mini {
  width: 90px;
  margin: 0 10px;
}
.el-input-number.is-controls-right .el-input__inner {
  padding-left: 5px;
  padding-right: 28px;
}
</style>
