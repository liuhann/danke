<template>
  <pop-wrapper :width="360" title="设置背景颜色/渐变" @show="show">
    <i slot="reference" class="gradient-box action" :style="{
      background: variable.value
    }"
    />
    <div class="gradient form">
      <el-radio-group v-model="gradientType" @change="typeChange">
        <el-radio label="radial-gradient">
          圆形渐变
        </el-radio>
        <el-radio label="linear-gradient">
          线性渐变
        </el-radio>
        <el-radio label="repeating-linear-gradient">
          线性重复渐变
        </el-radio>
      </el-radio-group>

      <div v-if="gradients && gradients.colorStopList.length > 1 && gradientType.indexOf('linear-gradient')>-1" class="set-deg form-item">
        <label>角度</label>
        <div class="position">
          <el-slider v-model="gradients.angle" :max="360" />
        </div>
      </div>

      <div v-if="gradients && gradients.colorStopList.length > 1 && gradientType === 'radial-gradient'" class="set-cc form-item">
        <label>圆心</label>
        <div class="field">
          <el-input-number v-model="cc[0]" size="mini" controls-position="right" @change="generate" />
          <el-input-number v-model="cc[1]" size="mini" controls-position="right" @change="generate" />
        </div>
      </div>

      <div v-if="gradients" class="steps">
        <div class="stops-title stop">
          <div class="stop-color">
            颜色
          </div>
          <div class="stop-position">
            位置
          </div>
          <div class="stop-action">
            <i class="el-icon-plus" @click="addColorStop" />
          </div>
        </div>

        <div v-for="(step, index) in gradients.colorStopList" :key="index" class="stop form-item">
          <div class="stop-color">
            <el-color-picker v-model="step.color" show-alpha size="small" />
          </div>
          <div class="stop-position">
            <el-input-number v-model="step.position" size="mini" controls-position="right" />
          </div>
          <div class="stop-action">
            <i class="el-icon-close" @click="deleteColorStop(index)" />
          </div>
        </div>
        <div class="form-item">
          <el-button size="mini" type="primary" @click="addColorStop">
            增加颜色
          </el-button>
          <el-button size="mini" @click="randomGradientColor">
            随机颜色
          </el-button>
        </div>
      </div>
    </div>
  </pop-wrapper>
</template>

<script>
import toolbarPopMixin from './toolbarPopMixin'
import { generateRegExp, parseGradient } from '../utils/parseGradient'
import lights from './color/lights'
import darks from './color/darks'

const regExpLib = generateRegExp()
const colorGradients = lights.concat(darks)

export default {
  name: 'PopSetGradient',
  mixins: [toolbarPopMixin],
  data () {
    return {
      gradientType: '',
      repeating: false,
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

    /**
     * 颜色转换，将 liner-gradient(10deg, color1, color2) 这样的css属性抽取为颜色列表、角度等信息
     */
    show () {
      const rGradientEnclosedInBrackets = /.*gradient\s*\(((?:\([^\)]*\)|[^\)\(]*)*)\)/ // Captures inside brackets - max one additional inner set.
      const match = rGradientEnclosedInBrackets.exec(this.variable.value);
      if (match && match.length) {
        this.gradientType = this.variable.value.match('[^(]+')[0]
        const gradients = parseGradient(regExpLib, match[1])
        if (this.gradientType.indexOf('linear-gradient') > -1 ) {
          // include linear-gradient
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
      } else {
        this.gradientType = 'linear-gradient'
        this.gradients = {
          colorStopList: [{
            color: this.variable.value,
            position: 0
          }]
        }
      }
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
      if (this.gradients.colorStopList.length > 1) {
        this.gradients.colorStopList.splice(index, 1)
      }
    },

    randomGradientColor () {
      const rand = colorGradients[Math.floor(Math.random() * colorGradients.length)]
      this.gradients.colorStopList = [{
        color: rand[0],
        position: 0
      }, {
        color: rand[1],
        position: 100
      }]
    },

    /**
     * 反向操作，将数据合并为css属性
     */
    generate () {
      if (this.gradients.colorStopList.length > 1) {
        if (this.gradientType.indexOf('linear-gradient') > -1) {
          this.variable.value = this.gradientType + '(' + this.gradients.angle + 'deg,'
              + this.gradients.colorStopList.map(stop => stop.color + ' ' + stop.position + '%').join(',')
            + ')'
        } else {
          this.variable.value = `radial-gradient(at ${this.cc[0]}% ${this.cc[1]}%,`
            + this.gradients.colorStopList.map(stop => stop.color + ' ' + stop.position + '%').join(',')
            + ')'
        }
      } else {
        this.variable.value = this.gradients.colorStopList[0].color
      }
    }
  }
}
</script>

<style lang="scss">
.gradient-box {
  box-shadow: 0 0 0 1px #ccc;
  width: 30px;
}
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
      flex: 1;
    }
    .stop-action {
      width: 30px;
      display: flex;
      align-items: center;
      .el-icon-plus {
        cursor: pointer;
      }
      .el-icon-refresh {
        cursor: pointer;
      }
      .el-icon-close {
        color: #7B7B7B;
        cursor: pointer;
      }
    }
  }
}
</style>
