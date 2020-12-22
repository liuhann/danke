<template>
  <van-popup v-model="show" position="top">
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
      <template v-for="(variable, index) in element.variables || []">
        <van-field v-if="variable.type==='fontWeight'" :key="index" label="文字粗细">
          <template #input>
            <van-slider v-model="variable.value" :min="200" :step="100" :max="900" />
          </template>
        </van-field>
        <van-field v-if="variable.type==='color'" :key="index" v-model="variable.value" center :label="variable.label || '颜色'">
          <template #button>
            <span :style="{
              backgroundColor: variable.value,
              height: '30px',
              width: '30px',
              display: 'block',
              border: '2px solid rgb(238, 238, 238)',
              borderRadius: '3px'
            }" @click="onColorPickerClick(variable)"
            >
            </span>
          </template>
        </van-field>
        <van-field v-if="variable.type === 'fontFamily'" :key="index" center :label="variable.label || '字体'">
          <template #input>
            {{ variable.value }}
          </template>
          <template #button>
            <van-button size="small" @click="onFontFamillyClick(variable)">选择</van-button>
          </template>
        </van-field>
        <van-field v-if="variable.type === 'fontSize'" :key="index" :label="variable.label || '字号'">
          <template #input>
            <van-slider v-model="variable.value" :step="4" :min="12" :max="200" />
          </template>
          <template #button>
            {{ variable.value }}
          </template>
        </van-field>
        <van-field v-if="variable.type === 'letterSpacing'" :key="index" :label="variable.label || '字间距'">
          <template #input>
            <van-slider v-model="variable.value" :step="1" :min="1" :max="50" />
          </template>
        </van-field>
      </template>

      <van-field v-if="element.hasOwnProperty('fill')" v-model="element.fill" label="填充色" center>
        <template #input>
          <span>
            {{ element.fill }}
          </span>
        </template>
        <template #button>
          <span :style="{
            backgroundColor: element.fill,
            height: '30px',
            width: '30px',
            display: 'block',
            border: '2px solid rgb(238, 238, 238)',
            borderRadius: '3px'
          }" @click="onColorPickerClick('fill')"
          >
          </span>
        </template>
      </van-field>

      <van-field
        v-if="element.hasOwnProperty('maskImage')"
        placeholder="插入文本内容"
        label="图片剪纸"
      >
        <template #input>
          <van-image :src="getImageUrl(element.maskImage)" width="28" height="28" />
        </template>
        <template #button>
          <van-button v-if="element.maskImage" size="small" @click="chooseMaskImage">更换</van-button>
          <van-button v-if="!element.maskImage" size="small" @click="chooseMaskImage">选择</van-button>
          <van-button v-if="element.maskImage" size="small" @click="deleteMaskImage">删除</van-button>
        </template>
      </van-field>

      <font-family ref="fontFamilly" @input="updateVariableValue" />
      <color-picker ref="colorPicker" @input="updateVariableValue" />
      <pop-vector-album-list ref="albumListPop" @input="choosePack" />
      <pop-vector-list ref="vectorListPop" title="选择裁切图案" @insert="chooseVector" />

      <div style="margin: 16px;">
        <van-button v-if="isEdit" color="linear-gradient(to right, #ff6034, #ee0a24)" @click="onDelete">刪除</van-button>
        <van-button v-if="!isEdit" type="primary" @click="onConfirm">增加</van-button>
      </div>
    </van-form>
  </van-popup>
</template>

<script>
import ColorPicker from './ColorPicker'
import FontFamily from './FontFamily.vue'
import PopVectorAlbumList from '../list/PopVectorAlbumList'
import PopVectorList from '../list/PopVectorList'
import { getImageUrl } from '../../xd-builder/mixins/imageUtils'

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
  components: { PopVectorList, PopVectorAlbumList, FontFamily, ColorPicker },
  props: { },
  data () {
    return {
      element: {},
      variable: null,
      isEdit: true,
      show: false
    }
  },
  computed: {
    masktable () {
      return this.element && (this.element.hasOwnProperty('mask'))
    }
  },
  methods: {
    getImageUrl,
    updateVariableValue (val) {
      if (this.variable) {
        this.variable.value = val
      } else {
        this.element.fill = val
      }
    },

    choosePack (pack) {
      this.$refs.vectorListPop.open(pack._id)
    },

    chooseVector (vector) {
      this.$refs.vectorListPop.close()
      this.$refs.albumListPop.close()
      this.element.maskImage = vector.url
    },

    chooseMaskImage () {
      this.$refs.albumListPop.open('mask')
    },

    deleteMaskImage () {
      this.element.maskImage = ''
    },

    onFontFamillyClick (variable) {
      this.variable = variable
      this.$refs.fontFamilly.open()
    },

    onColorPickerClick (variable) {
      if (typeof variable === 'string') {
        this.colorField = variable
        this.variable = null
      } else {
        this.variable = variable
      }
      this.$refs.colorPicker.open()
    },

    open (element, isEdit) {
      this.show = true
      this.isEdit = isEdit
      if (element) {
        this.element = element
      }
    },
    getVariableLabel(variable) {
      if (variable.label) {
        return variable.label
      }
      return fontLabels[variable.name] || variable.type
    },

    onDelete () {
      this.$emit('delete', this.element)
      this.show = false
    },
    onConfirm () {
      this.$emit('insert', JSON.parse(JSON.stringify(this.element)))
      this.show = false
    }

  }
}
</script>

<style scoped>

</style>
