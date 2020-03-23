<template>
<el-popover
  placement="bottom"
  width="240"
  @show="showPop"
  trigger="click">
  <a class="action" slot="reference">
    <img :src="ICON">
  </a>
  <div class="tranform">
    <div class="field" v-for="(transform, index) of element.style.transforms" :key="index">
      <div class="control label">
        <el-select v-model="transform.key" size="mini">
          <el-option v-for="transformKey of transformKeys" :label="transformKey.label" :value="transformKey.value" :key="transformKey"/>
        </el-select>
      </div>
      <div class="control value">
        <el-input-number v-model.number="transform.value" size="mini" controls-position="right"/>
      </div>
      <div class="control action">
        <el-button type="text" icon="el-icon-delete" @click="element.style.transforms.splice(index, 1)" size="mini"/>
      </div>
    </div>
    <div class="control">
      <el-button @click="addTransform" size="mini">增加</el-button>
    </div>
  </div>
</el-popover>
</template>

<script>
import toolbarPopMixin from './toolbarPopMixin'
import ICON from './res/transformation.svg'
export const transformKeys = [{
  label: '横向拉伸',
  value: 'scaleX'
}, {
  label: '纵向拉伸',
  value: 'scaleY'
}, {
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

export const transformValue = {
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0
}

export const transformUnits = {
  skewX: 'deg',
  skewY: 'deg',
  rotateX: 'deg',
  rotateY: 'deg',
  rotateZ: 'deg'
}
export default {
  name: 'PopTransform',
  mixins: toolbarPopMixin,
  components: {
  },
  data () {
    return {
      transformKeys,
      ICON
    }
  },
  methods: {
    addTransform () {
      this.element.style.transforms.push({
        key: '',
        value: 0
      })
    },
    showPop () {
      if (!this.element.style.transforms) {
        this.$set(this.element.style, 'transforms', [])
      }
    }
  }
}
</script>

<style scoped>

</style>
