<template>
<el-popover
  placement="bottom-start"
  popper-class="toolbar-pop"
  width="360"
  title="设置渐变"
  @show="show"
  trigger="click">
  <i class="action" slot="reference" :style="{
      background: variable.value
    }"></i>
  <div class="gradient form">
    <el-radio-group v-model="gradientType" @change="typeChange">
      <el-radio label="radial-gradient">圆形渐变</el-radio>
      <el-radio label="linear-gradient">线型渐变</el-radio>
    </el-radio-group>

    <div class="set-deg form-item" v-if="gradients && gradientType === 'linear-gradient'">
      <label>角度</label>
      <div class="position">
        <el-slider v-model="gradients.angle" :max="360"/>
      </div>
    </div>

    <div class="set-cc form-item" v-if="gradients && gradientType === 'radial-gradient'">
      <label>圆心</label>
      <div class="field">
        <el-input-number @change="generate" size="mini" controls-position="right" v-model="cc[0]"/>
        <el-input-number @change="generate" size="mini" controls-position="right" v-model="cc[1]"/>
      </div>
    </div>

    <div class="steps" v-if="gradients">
      <div class="stops-title stop">
        <div class="stop-color">颜色</div>
        <div class="stop-position">
          位置
        </div>
        <div class="stop-action"> <i @click="addColorStop" class="el-icon-plus"></i> </div>
      </div>

      <div class="stop form-item" v-for="(step, index) in gradients.colorStopList" :key="index">
        <div class="stop-color">
          <el-color-picker show-alpha v-model="step.color"/>
        </div>
        <div class="stop-position">
          <el-slider v-model="step.position" :max="100"/>
        </div>
        <div class="stop-action">
          <i class="el-icon-close"></i>
        </div>
      </div>
    </div>

  </div>
</el-popover>
</template>

<script>
import { RadioGroup, Radio, Popover, Slider, ColorPicker, InputNumber } from 'element-ui'
import { generateRegExp, parseGradient } from '../utils/parseGradient'

const regExpLib = generateRegExp()

export default {
  name: 'PopSetGradient',
  components: {
    [Popover.name]: Popover,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [ColorPicker.name]: ColorPicker,
    [Slider.name]: Slider,
    [InputNumber.name]: InputNumber
  },
  props: {
    variable: {
      type: Object
    }
  },
  data () {
    return {
      gradientType: '',
      cc: [50, 50],
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
      } else {
        if (gradients.colorStopList[0].color === 'at') {
          this.cc = gradients.original.substring(0, gradients.original.indexOf(',')).match(/ \d+/g).map(m => parseInt(m))
          gradients.colorStopList.shift()
        }
      }

      for (let stop of gradients.colorStopList) {
        stop.position = parseInt(stop.position)
      }
      this.gradients = gradients
    },

    typeChange () {
      this.generate()
    },

    addColorStop () {
      this.gradients.colorStopList.push({
        color: '#cc2',
        position: 100
      })
    },

    deleteColorStop (index) {
      if (this.gradients.colorStopList.length > 2) {
        this.gradients.colorStopList.splice(index, 1)
      }
    },

    generate () {
      if (this.gradientType === 'linear-gradient') {
        this.variable.value = this.gradientType + '(' + this.gradients.angle + 'deg,'
            + this.gradients.colorStopList.map(stop => stop.color + ' ' + stop.position + '%').join(',')
          + ')'
      } else {
        this.variable.value = `radial-gradient(at ${this.cc[0]}% ${this.cc[1]}%,`
          + this.gradients.colorStopList.map(stop => stop.color + ' ' + stop.position + '%').join(',')
          + ')'
      }
    }
  }
}
</script>

<style lang="scss">
.gradient.form {
  .form-item {
    display: flex;
    height: 36px;
    line-height: 36px;
    margin-top: 10px;
    label {
      width: 50px;
      color: #bbbfc5;
    }
    .position {
      width: 240px;
    }
  }

  .el-radio-group {
    margin: 10px 0;
  }

  .stops-title {
    color: #bbbfc5;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .stop {
    display: flex;
    margin-top: 10px;
    .stop-color {
      width: 50px
    }
    .stop-position {
      width: 240px;
    }
    .stop-action {
      width: 50px;
      .el-icon-plus {
        margin-left: 50px;
        cursor: pointer;
      }
      .el-icon-close {
        margin-left: 50px;
        color: #7B7B7B;
        cursor: pointer;
      }
    }
  }
}
</style>
