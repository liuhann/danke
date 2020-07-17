<template>
  <pop-wrapper v-slot="{ visible }" title="元素属性" :width="420" icon="el-icon-warning-outline">
    <el-form v-if="visible" label-width="80px" size="mini" class="more-action-form">
      <el-form-item label="名称">
        <el-input v-model="element.name" />
      </el-form-item>
      <el-form-item label="宽高">
        <el-input-number v-model="element.width" :precision="2" controls-position="right" size="mini" />-<el-input-number v-model="element.height" :precision="2" controls-position="right" size="mini" />
      </el-form-item>
      <el-form-item label="坐标">
        <el-input-number v-model="element.x" :precision="2" controls-position="right" size="mini" />-<el-input-number v-model="element.y" :precision="2" controls-position="right" size="mini" />
      </el-form-item>
      <el-form-item label="适应">
        <el-select v-model="element.fit">
          <el-option label="适应" value="cover" />
          <el-option label="包含" value="contain" />
          <el-option label="拉伸" value="fill" />
        </el-select>
      </el-form-item>
      <el-form-item label="视角高度">
        <el-input-number v-model="element.style.perspective" controls-position="right" size="mini" />
      </el-form-item>
      <el-form-item label="次序">
        <el-button-group size="mini">
          <el-button @click="moveElementTop">顶层</el-button>
          <el-button @click="moveElementUp">上一层</el-button>
          <el-button @click="moveElementDown">下一层</el-button>
          <el-button @click="moveElementBottom">底层</el-button>
        </el-button-group>
      </el-form-item>
    </el-form>
  </pop-wrapper>
</template>

<script>
import toolbarPopMixin from './toolbarPopMixin'
import interactMixins from '../mixins/interactMixins'

export default {
  name: 'PopMoreAction',
  components: {
  },
  mixins: [ toolbarPopMixin, interactMixins ],
  data () {
    return {
    }
  },
  computed: { },
  methods: {
    reInitElementDragResize (val) {
      this.$emit('reset', this.element)
    },

    // 移动元素到最顶层 （数组最后一个）
    moveElementTop () {
      let currentIndex = this.scene.elements.indexOf(this.element)
      while (currentIndex < this.scene.elements.length - 1) {
        this.moveElementUp()
        currentIndex ++
      }
    },
    moveElementBottom () {
      let currentIndex = this.scene.elements.indexOf(this.element)
      while (currentIndex > 0) {
        this.moveElementDown()
        currentIndex --
      }
    },
    // 移动元素上一层 （数组向后一个）
    moveElementUp () {
      const currentIndex = this.scene.elements.indexOf(this.element)
      if (currentIndex < this.scene.elements.length - 1) {
        this.scene.elements.splice(currentIndex, 1)
        this.scene.elements.splice(currentIndex + 1, 0, this.element)
      }
    },
    moveElementDown () {
      const currentIndex = this.scene.elements.indexOf(this.element)
      if (currentIndex > 0) {
        this.scene.elements.splice(currentIndex, 1)
        this.scene.elements.splice(currentIndex - 1, 0, this.element)

        // this.scene.elements[currentIndex] = this.scene.elements[currentIndex - 1]
        // this.scene.elements[currentIndex - 1] = this.element
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.more-action-form {
  padding: 16px;
  .el-input-number--mini {
    width: 110px;
    margin: 0 10px;
  }
  .el-input-number.is-controls-right .el-input__inner {
    padding-left: 5px;
    padding-right: 28px;
  }
}
</style>
