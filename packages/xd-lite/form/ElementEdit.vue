<template>
  <van-form>
    <van-field
      v-if="element.text"
      v-model="element.text"
      name="内容"
      label="内容"
      placeholder="插入文本内容"
    />

    <van-field
      v-for="(variable, index) in element.variables || []"
      :key="index"
      :label="getVariableLabel(variable)"
    >
      <template #input>
        <van-tabs v-if="variable.type==='fontWeight'" v-model="variable.value" type="card">
          <van-tab title="细" name="lighter"></van-tab>
          <van-tab title="正常" name="normal"></van-tab>
          <van-tab title="粗" name="bold"></van-tab>
          <van-tab title="加粗" name="bolder"></van-tab>
        </van-tabs>
        <van-stepper v-if="variable.type==='fontSize' || variable.type==='px' || variable.type==='number' || variable.type==='percent'" v-model="variable.value" min="8" theme="round" />
      </template>
    </van-field>

    <van-field v-if="element.hasOwnProperty('fill')" label="填充色">
      <el-color-picker v-model="element.fill" show-alpha />
    </van-field>
    <van-field label="旋转">
      <template #input>
        <van-slider v-model="element.rotate" :max="360" @change="rotateChange" />
      </template>
    </van-field>
    <van-field label="堆放">
      <template #input>
        <van-grid>
          <van-grid-item icon="photo-o" text="最上" @click="() => moveTop(element, scene)" />
          <van-grid-item icon="photo-o" text="上移" />
          <van-grid-item icon="photo-o" text="文字" />
          <van-grid-item icon="photo-o" text="文字" />
        </van-grid>
      </template>
    </van-field>
    <div style="margin: 16px;">
      <van-button color="linear-gradient(to right, #ff6034, #ee0a24)" @click="() => deleteElement(element, scene)">刪除</van-button>
      <van-button v-if="!element.locked" @click="lockElement">锁定</van-button>
      <van-button v-if="element.locked" @click="unlockElement">解锁</van-button>
    </div>
  </van-form>
</template>

<script>
import { lockElement, unlockElement, moveUp, moveBottom, moveDown, moveTop, deleteElement } from '../../xd-builder/utils/sceneActions'

const fontLabels = {
  'fontFamily': '字体',
  'textAlign': '对齐方式',
  'fontWeight': '粗细',
  'fontSize': '字号',
  'letterSpacing': '字间距',
  'color': '颜色'
}

export default {
  name: "ElementEdit",
  props: {
    element: {
      type: Object
    },
    scene: {
      type: Object
    }
  },
  methods: {
    lockElement, unlockElement, moveUp, moveBottom, moveDown, moveTop,deleteElement,
    getVariableLabel(variable) {
      if (variable.label) {
        return variable.label
      }
      return fontLabels[variable.name] || variable.type
    },
    rotateChange () {

    }
  }
}
</script>

<style scoped>

</style>