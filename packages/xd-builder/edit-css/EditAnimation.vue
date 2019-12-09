<template>
<div class="edit-animation">
  <div class="field has-addons">
    <div class="control field-lb">
      触发时机
    </div>
    <div class="control">
      <el-radio-group v-model="animation.stage" size="mini">
        <el-radio v-for="align of animationStages" :label="align.key" :key="align.key">{{align.label}}</el-radio>
      </el-radio-group>
    </div>
  </div>
  <div class="field has-addons">
    <div class="control field-lb">
      效果
    </div>
    <div class="control">
      <el-tag size="mini" v-if="animation.name">{{animation.name}}</el-tag>
    </div>
    <div class="control">
      <el-button type="text" @click="chooseAnimation" size="mini">选择</el-button>
    </div>
  </div>

  <div class="field has-addons">
    <div class="control field-lb">
      持续
    </div>
    <div class="control">
      <edit-len v-model="animation.duration" :step="50" :with-unit="false"></edit-len>
    </div>
    <div class="control">
      延迟
    </div>
    <div class="control">
      <edit-len v-model="animation.delay" :step="50" :with-unit="false"></edit-len>
    </div>
  </div>
  <div class="field has-addons">
    <div class="control field-lb">
      缓动
    </div>
    <div class="control">
      <el-select v-model="animation.timing" size="mini">
        <el-option v-for="(value, key) in cubicBerziers" :value="value" :key="key" :label="key" />
      </el-select>
    </div>
  </div>
  <div class="field has-addons">
    <div class="control field-lb">
      特性
    </div>
    <div class="control">
      <el-checkbox size="mini" v-model="animation.overflow">溢出</el-checkbox>
    </div>
    <div class="control">
      <el-checkbox v-model="animation.infinite">重复</el-checkbox>
    </div>
    <div class="control">
      <el-button icon="el-icon-delete" type="danger" size="mini" @click="$emit('remove')"></el-button>
    </div>
  </div>
  <el-divider />
</div>
</template>

<script>
import EditLen from '../components/props/EditLen.vue'
import { Button, InputNumber, ColorPicker, Checkbox, RadioGroup, RadioButton, Tag, Divider, Select, Option, Radio } from 'element-ui'
import frameModel from '../../frames/frameChooseDialog'
import cubicBerziers from '../../frames/model/cubic-beziers'
export default {
  name: 'EditAnimation',
  components: {
    [Button.name]: Button,
    [InputNumber.name]: InputNumber,
    [ColorPicker.name]: ColorPicker,
    [Checkbox.name]: Checkbox,
    [RadioGroup.name]: RadioGroup,
    [RadioButton.name]: RadioButton,
    [Divider.name]: Divider,
    [Select.name]: Select,
    [Option.name]: Option,
    [Radio.name]: Radio,
    [Tag.name]: Tag,
    EditLen
  },
  props: {
    animation: {
      type: Object
    }
  },
  data () {
    return {
      cubicBerziers,
      animationStages: [{
        key: 'in',
        label: '进入'
      }, {
        key: 'out',
        label: '离开'
      }]
    }
  },
  watch: {

  },
  methods: {
    /**
     * 打开动画选择面板，选择动画名称
     * @param type
     */
    chooseAnimation (type) {
      frameModel.choose(type, (animation) => {
        // 回调传回选择好的动画
        this.animation.name = animation.name
        this.animation.duration = animation.duration
        if (!this.animation.delay) {
          this.animation.delay = animation.delay
        }
        this.animation.timing = animation.timing
        if (!animation.cssFrame) {
          this.animation.cssFrame = ''
          this.animation.frames = animation.frames
        } else {
          this.animation.cssFrame = animation.cssFrame
        }
      })
    },

    pasteStyle () {
      if (this.copied) {
        this.animation.name = this.copied.animation.name
        this.animation.desc = this.copied.animation.desc
        this.animation.duration = this.copied.animation.duration
        this.animation.delay = this.copied.animation.delay
        this.animation.timing = this.copied.animation.timing
        this.animation.frames = this.copied.animation.frames
        this.copied = null
      }
    },

    copyAnimation () {
      this.ctx.animationCopied = JSON.parse(JSON.stringify(this.animation))
    },
    pasteAnimation () {
      if (this.ctx.animationCopied) {
        this.animation = JSON.parse(JSON.stringify(this.ctx.animationCopied))
      }
    },
    pasteDelayAnimation () {
      if (this.ctx.animationCopied) {
        Object.assign(this.animation, JSON.parse(JSON.stringify(this.ctx.animationCopied)))
        this.animation.delay = this.animation.delay + this.animation.duration
        this.copyAnimation()
      }
    }
  }
}
</script>

<style>
</style>
