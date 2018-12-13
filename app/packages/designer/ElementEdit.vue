<template>
<div class="element-edit">
  <van-tabs v-model="active" animated>
    <van-tab title="定位">
      <van-cell-group>
        <van-cell title="横向">
          <van-stepper v-model="position.x" />
          <van-radio-group v-model="position.xu">
            <van-radio name="vw">屏宽</van-radio>
            <van-radio name="vh">屏高</van-radio>
          </van-radio-group>
        </van-cell>
        <van-cell title="纵向">
          <van-stepper v-model="position.y" />
          <van-radio-group v-model="position.yu">
            <van-radio name="vw">屏宽</van-radio>
            <van-radio name="vh">屏高</van-radio>
          </van-radio-group>
        </van-cell>
        <van-cell title="宽度">
          <van-stepper v-model="position.w" />
          <van-radio-group v-model="position.wu">
            <van-radio name="vw">屏宽</van-radio>
            <van-radio name="vh">屏高</van-radio>
          </van-radio-group>
        </van-cell>
        <van-cell title="高度">
          <van-stepper v-model="position.h" />
          <van-radio-group v-model="position.hu">
            <van-radio name="vw">屏宽</van-radio>
            <van-radio name="vh">屏高</van-radio>
          </van-radio-group>
        </van-cell>
      </van-cell-group>
    </van-tab>
    <van-tab title="四角裁切">
      <van-row type="flex" justify="space-around">
        <van-col span="10"><van-slider v-model="clip.ax" /></van-col>
        <van-col span="10"><van-slider v-model="clip.ay" /></van-col>
      </van-row>
      <van-row type="flex" justify="space-around">
        <van-col span="10"><van-slider v-model="clip.bx" /></van-col>
        <van-col span="10"><van-slider v-model="clip.by" /></van-col>
      </van-row>
      <van-row type="flex" justify="space-around">
        <van-col span="10"><van-slider v-model="clip.cx" /></van-col>
        <van-col span="10"><van-slider v-model="clip.cy" /></van-col>
      </van-row>
      <van-row type="flex" justify="space-around">
        <van-col span="10"><van-slider v-model="clip.dx" /></van-col>
        <van-col span="10"><van-slider v-model="clip.dy" /></van-col>
      </van-row>
    </van-tab>
    <van-tab title="进入特效">
      <van-row type="flex" justify="space-around">
        <van-col span="10">特效</van-col>
        <van-col span="10"></van-col>
      </van-row>
      <van-row type="flex" justify="space-around">
        <van-col span="10">时长</van-col>
        <van-col span="10"></van-col>
      </van-row>
      <van-row type="flex" justify="space-around">
        <van-col span="10">延迟</van-col>
        <van-col span="10"></van-col>
      </van-row>
    </van-tab>
    <van-tab title="离开特效">
      <van-row type="flex" justify="space-around">
        <van-col span="10">特效</van-col>
        <van-col span="10"></van-col>
      </van-row>
      <van-row type="flex" justify="space-around">
        <van-col span="10">时长</van-col>
        <van-col span="10"></van-col>
      </van-row>
      <van-row type="flex" justify="space-around">
        <van-col span="10">延迟</van-col>
        <van-col span="10"></van-col>
      </van-row>
    </van-tab>
  </van-tabs>

</div>
</template>

<script>
const REG_LEN = /([+-]?[0-9#]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/
export default {
  name: 'ElementEdit',
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      active: '定位',
      position: {
        x: 0,
        xu: 'vw',
        y: 0,
        yu: 'vh',
        w: 0,
        wu: 'vw',
        h: 0,
        hu: 'vh'
      },
      clip: {
        ax: 0,
        ay: 0,
        bx: 100,
        by: 0,
        cx: 100,
        cy: 100,
        dx: 0,
        dy: 100
      }
    }
  },
  watch: {
    value () {
      this.setDataFromValue()
    },
    position: {
      handler: function (val, oldVal) {
        this.value.x = this.position.x + this.position.xu
        this.value.y = this.position.y + this.position.yu
        this.value.width = this.position.w + this.position.wu
        this.value.height = this.position.h + this.position.hu
      },
      deep: true
    },
    clip: {
      handler: function (val, oldVal) {
        this.value.clipPath = `polygon(${this.clip.ax}% ${this.clip.ay}%, ${this.clip.bx}% ${this.clip.by}%, ${this.clip.cx}% ${this.clip.cy}%, ${this.clip.dx}% ${this.clip.dy}%)`
      },
      deep: true
    }
  },

  created () {
    this.setDataFromValue()
  },

  methods: {
    setDataFromValue () {
      let xe = this.getLengthUnit(this.value.x)
      this.position.x = xe.number
      this.position.xu = xe.unit
      let ye = this.getLengthUnit(this.value.y)
      this.position.y = ye.number
      this.position.yu = ye.unit
      let we = this.getLengthUnit(this.value.width)
      this.position.w = we.number
      this.position.wu = we.unit
      let he = this.getLengthUnit(this.value.height)
      this.position.h = he.number
      this.position.hu = he.unit

      if (this.value.clipPath) {
        const matches = this.value.clipPath.match(/[\d]+/g)
        if (matches.length === 8) {
        }
      }
    },

    getLengthUnit (len) {
      // -15vw ->  [-15vw,-15,vw]
      const splits = REG_LEN.exec(len)
      return {
        number: splits[1],
        unit: splits[2]
      }
    }
  }
}
</script>

<style lang="less">
.element-edit {
  .van-row {
    height: 48px;
    box-sizing: border-box;
    padding-top: 23px;
  }
  .van-cell {
    .van-cell__title {
      line-height: 30px;
    }
    .van-cell__value {
      flex: 4;

      .van-stepper,.van-radio-group, .van-radio {
        float: left;
      }
      .van-radio {
        margin-left: 5px;
        padding: 2px;
        .van-radio__label {
          margin-right: 5px;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
