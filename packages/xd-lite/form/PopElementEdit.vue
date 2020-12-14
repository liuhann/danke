<template>
  <van-popup v-model="show" position="top" :style="{ height: '50%' }">
    <van-nav-bar>
      <template #right>
        <van-icon name="close" size="20" @click="show = false" />
      </template>
      <template #left>
        属性编辑
      </template>
    </van-nav-bar>
    <van-form>
      <!--设置文本的内容-->
      <van-field
        v-if="element.text != null"
        v-model="element.text"
        name="内容"
        label="内容"
        placeholder="插入文本内容"
      />
      <!--设置元素变量-->
      <van-field
        v-for="(variable, index) in element.variables || []"
        :key="index"
        class="pr-5"
        :label="getVariableLabel(variable)"
      >
        <template #input>
          <van-slider v-if="variable.type==='fontWeight'" v-model="variable.value" :min="200" :step="100" :max="900" />
          <color-picker v-if="variable.type === 'color'" v-model="variable.value" />
          <font-family v-if="variable.type === 'fontFamily'" v-model="variable.value" />
          <van-slider v-if="variable.type=== 'deg'" v-model="variable.value" :min="0" :max="360" />
          <van-stepper v-if="variable.type==='fontSize' || variable.type==='px' || variable.type==='number' || variable.type==='percent'" v-model="variable.value" class="mr-4" />
        </template>
      </van-field>

      <van-field v-if="element.hasOwnProperty('fill')" label="填充色">
        <el-color-picker v-model="element.fill" show-alpha />
      </van-field>
      <van-field label="堆放">
        <template #input>
          <van-button size="small" plain @click="() => moveTop(element, scene)">最上</van-button>
          <van-button size="small" plain @click="() => moveUp(element, scene)">上移</van-button>
          <van-button size="small" plain @click="() => moveDown(element, scene)">下移</van-button>
          <van-button size="small" plain @click="() => moveBottom(element, scene)">最下</van-button>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button color="linear-gradient(to right, #ff6034, #ee0a24)" @click="onDelete">刪除</van-button>
        <van-button v-if="!element.locked" @click="lockElement">锁定</van-button>
        <van-button v-if="element.locked" @click="unlockElement">解锁</van-button>
      </div>
    </van-form>
  </van-popup>
</template>

<script>
import { lockElement, unlockElement, moveUp, moveBottom, moveDown, moveTop, deleteElement } from '../../xd-builder/utils/sceneActions'
import ColorPicker from './ColorPicker'
import FontFamily from './FontFamily.vue'

const fontLabels = {
  'fontFamily': '字体',
  'textAlign': '对齐方式',
  'fontWeight': '粗细',
  'fontSize': '字号',
  'letterSpacing': '字间距',
  'color': '颜色'
}

export default {
  name: "PopElementEdit",
  components: { FontFamily, ColorPicker },
  props: {
    element: {
      type: Object
    },
    scene: {
      type: Object
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    open () {
      this.show = true
    },
    lockElement, unlockElement, moveUp, moveBottom, moveDown, moveTop,deleteElement,
    getVariableLabel(variable) {
      if (variable.label) {
        return variable.label
      }
      return fontLabels[variable.name] || variable.type
    },

    onDelete () {
      deleteElement(this.element, this.scene)
      this.show = false
    },
    rotateChange () {

    }
  }
}
</script>

<style scoped>

</style>
