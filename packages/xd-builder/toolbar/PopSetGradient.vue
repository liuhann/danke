<template>
<el-popover
  placement="bottom-start"
  popper-class="toolbar-pop"
  width="360"
  @show="show"
  trigger="click">
  <i class="action" slot="reference" :style="{
      background: variable.value
    }"></i>
  <div class="gradient form">
    <div>
      {{variable.value}}
    </div>
    <el-radio-group v-model="gradientType">
      <el-radio label="radial-gradient">圆形渐变</el-radio>
      <el-radio label="linear-gradient">线型渐变</el-radio>
    </el-radio-group>

    <div class="set-deg" v-if="gradients">
        <el-slider v-model="gradients.angle" :max="360"/>
    </div>

    <div class="steps" v-if="gradients">
      <div class="step" v-for="(step, index) in gradients.colorStopList" :key="index">
        <el-color-picker v-model="step.color"/>
        <el-slider v-model="step.position" :max="100"/>
      </div>
    </div>

  </div>
</el-popover>
</template>

<script>
import { RadioGroup, Radio, Popover, Slider, ColorPicker } from 'element-ui'
import { generateRegExp, parseGradient } from '../utils/parseGradient'

const regExpLib = generateRegExp()

export default {
  name: 'PopSetGradient',
  components: {
    [Popover.name]: Popover,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [ColorPicker.name]: ColorPicker,
    [Slider.name]: Slider
  },
  props: {
    variable: {
      type: Object
    }
  },
  data () {
    return {
      gradientType: '',
      gradients: null,
    }
  },
  computed: {
    // gradientType: {
    //   get () {
    //     return this.variable.value.match('[^(]+')[0]
    //   },
    //   set (gradient) {
    //     this.variable.value = `${gradient}(${gradient === 'radial-gradient'? 'at 50% 50%': '0deg'}, ${this.colorSteps.join(',')})`
    //   }
    // }
  },
  watch: {
    gradients: {
      deep: true,
      handler() {
        this.generate()
      }
    }
  },
  methods: {
    show () {
      const rGradientEnclosedInBrackets = /.*gradient\s*\(((?:\([^\)]*\)|[^\)\(]*)*)\)/ // Captures inside brackets - max one additional inner set.
      const match = rGradientEnclosedInBrackets.exec(this.variable.value);
      this.gradientType = this.variable.value.match('[^(]+')[0]
      const gradients = parseGradient(regExpLib, match[1])
      if (this.gradientType === 'linear-gradient') {
        gradients.angle = parseInt(gradients.angle)
      }

      for (let stop of gradients.colorStopList) {
        stop.position = parseInt(stop.position)
      }

      this.gradients = gradients
    },

    generate () {
      this.variable.value = this.gradientType + '(' + this.gradients.angle + 'deg,'
          + this.gradients.colorStopList.map(stop => stop.color + ' ' + stop.position + '%').join(',')
        + ')'
    }
  }
}
</script>

<style>

</style>