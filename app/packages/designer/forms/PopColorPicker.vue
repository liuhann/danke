<template>
<van-popup v-model="isShow" class="pop-color-picker" position="bottom" :overlay="false">
  <van-row type="flex" justify="space-around" class="header">
    <van-col span="4">颜色 </van-col>
    <van-col span="16"><div class="color-box" :style="{backgroundColor: colorDisplay}"></div></van-col>
    <van-col span="2"><van-icon name="cross" @click="showPopup = false"></van-icon></van-col>
  </van-row>
  <van-cell-group>
    <van-cell title="R">
      <van-slider v-model="colorR" :step="0.5"/>
    </van-cell>
    <van-cell title="G">
      <van-slider v-model="colorG" :step="0.5"/>
    </van-cell>
    <van-cell title="B">
      <van-slider v-model="colorB" :step="0.5"/>
    </van-cell>
    <van-cell title="透明度">
      <van-slider v-model="colorA"/>
    </van-cell>
  </van-cell-group>

  <div class="color-container">
    <div v-for="(color, index) in colors" :key="index" class="pure-color color-box" :style="{backgroundColor: color}" @click="setColor(index)">
      <van-icon name="success" v-if="currentIndex === index"></van-icon>
    </div>
  </div>
</van-popup>
</template>

<script>
import colorUtils from '../../utils/colors'
export default {
  name: 'PopColorPicker',
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      currentIndex: -1,
      isShow: false,
      color: this.value,
      colors: [],
      colorR: 100,
      colorG: 100,
      colorB: 100,
      colorA: 100,
      recentColors: []
    }
  },
  created () {

  },
  computed: {
    colorDisplay () {
      return `rgba(${Math.floor(this.colorR * 2.55)},${Math.floor(this.colorG * 2.55)},${Math.floor(this.colorB * 2.55)},${this.colorA / 100})`
    }
  },
  methods: {
    show () {
      this.isShow = true
      this.generateColor(8)
    },
    generateColor (count) {
      this.colors = []
      for (let i = 0; i < count; i++) {
        this.colors.push('#' + (Math.random() * 0xFFFFFF << 0).toString(16))
      }
    },
    setColor (index) {
      this.currentIndex = index
      let color = this.colors[index]
      let { r, g, b } = colorUtils.hexToRgba(color)
      this.colorR = Math.floor(r / 2.55)
      this.colorG = Math.floor(g / 2.55)
      this.colorB = Math.floor(b / 2.55)
      this.colorA = 100
      this.$emit('input', color)
    }
  }
}
</script>

<style lang="less">
.pop-color-picker {
  border-top: 1px solid #efefef;
  .van-icon-success {
    margin: 2.2vw;
    font-size: 6vw;
    color: #000;
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
  .color-container {
    overflow-y: auto;
    display: flex;
    line-height: 2px;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .color-box, .rgb-preview {
    width: 10vw;
    margin: 1vw;
    border-radius: 4px;
    height: 10vw;
  }
}

</style>
