<template>
<div class="color-picker">
  <div class="color-preview" :style="{backgroundColor: value}" @click="isShow = true">
  </div>
  <van-popup v-model="isShow" class="pop-color-picker" position="bottom" :overlay="true">
    <van-cell title="颜色选取">
      <van-icon slot="right-icon" name="cross" class="custom-icon" @click="isShow = false"/>
    </van-cell>
    <div class="color-container">
      <van-cell title="透明度">
        <van-slider v-model="materialSlider" :step="2"/>
      </van-cell>
      <div v-for="(value, key) in materialColors" :key="key" class="material-color" :style="{backgroundColor: value[stepKey]||value['50']||value}" @click="chooseColor(value)">
      </div>
    </div>
  </van-popup>
</div>
</template>

<script>
import materialColors from '../../templates/material-colors'

export default {
  name: 'PopColorPicker',
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      materialSlider: 0,
      currentIndex: -1,
      isShow: false,
      materialColors: materialColors,
      color: this.value
    }
  },
  created () {
  },
  computed: {
    materialSteps () {
      return ['900', '800', '700', '600', '500', '400', '300', '200', '100', '50', 'a700', 'a400', 'a200', 'a100']
    },

    step () {
      return Math.floor(100 / this.materialSteps.length)
    },

    stepKey () {
      return this.materialSteps[Math.floor(this.materialSteps.length * (this.materialSlider / 100))]
    }
  },
  methods: {
    chooseColor (value) {
      const color = value[this.stepKey] || value['50'] || value
      this.isShow = false
      this.$emit('input', color)
    }
  }
}
</script>

<style lang="less">
.color-picker {
  .van-icon {
    font-size: 20px;
  }
  .pop-color-picker {
    border-top: 1px solid #efefef;
  }
  .color-container {
    overflow-y: auto;
    display: flex;
    line-height: 2px;
    flex-wrap: wrap;
    justify-content: space-around;
    .material-color {
      width: 14vw;
      height: 14vw;
    }
  }

  .van-cell__title {
    flex: 1;
  }
  .van-cell__value {
    padding: 10px;
    flex: 4;
  }
  .van-slider {
    top: 50%
  }

  .color-preview {
    box-sizing: border-box;
    border: 1px solid #efefef;
    width: 40px;
    border-radius: 4px;
    height: 40px;
  }
}

</style>
