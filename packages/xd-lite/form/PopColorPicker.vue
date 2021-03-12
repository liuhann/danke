<template>
  <van-popup
    v-model="show"
    class="color-picker"
    position="bottom"
    :style="{
      height: '50%'
    }"
  >
    <van-nav-bar>
      <template #right>
        <van-icon name="cross" size="20" @click="show = false" />
      </template>
      <template #left>
        颜色选择
      </template>
    </van-nav-bar>
    <div :style="{
      borderRadius: '10px',
      margin: '10px',
      overflow: 'hidden'
    }"
    >
      <div v-for="(series, index) of colorSeries" :key="index" class="color-series">
        <van-button v-for="color of series" :key="color" type="info" :color="color" square size="small" @click="confirmColor(color)" />
      </div>
    </div>
  </van-popup>
</template>
<script>
import {
  red, volcano, orange, gold, yellow, lime, green, cyan, blue, geekblue, purple, magenta, grey, presetPrimaryColors, generate
} from '@ant-design/colors'

const antColors = [generate('#ccc'), red, volcano, orange, gold, yellow, lime, green, cyan, blue, geekblue, purple, magenta, grey]

const opacities = [{
  text: '1'
}, {
  text: '0.9'
}, {
  text: '0.8'
}, {
  text: '0.7'
}, {
  text: '0.6'
}, {
  text: '0.5'
},{
  text: '0.4'
},{
  text: '0.3'
},{
  text: '0.2'
},{
  text: '0.1'
},{
  text: '0'
}]

export default {
  name: 'ColorPicker',
  props: { },
  data () {
    return {
      presetPrimaryColors,
      activeNames: [],
      colorIndex: 6,
      colorSeries: antColors,
      columns: this.getColumns(),
      show: false
    }
  },
  methods: {
    open () {
      this.show = true
    },
    hexToRgba (hexValue) {
      const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
      const hex = hexValue.replace(rgx, (m, r, g, b) => r + r + g + g + b + b)
      const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      const r = parseInt(rgb[1], 16)
      const g = parseInt(rgb[2], 16)
      const b = parseInt(rgb[3], 16)
      return {
        r,
        g,
        b
      }
    },
    getColumns () {
      const columns = []
      for (let colors of antColors) {
        const item = {
          color: colors[5],
          text: this.getColorBlock(colors[5]),
          defaultIndex: 5,
          children : []
        }
        for (let color of colors) {
          item.children.push({
            text: this.getColorBlock(color),
            color,
            children: opacities
          })
        }
        columns.push(item)
      }
      return columns
    },

    onConfirm (payload) {
      const { r, g, b } = this.hexToRgba(payload[1].substr(15, 7))
      const a = payload[2]
      this.$emit('input', `rgba(${r}, ${g}, ${b}, ${a})`)
      this.show = false
    },

    confirmColor (color) {
      this.$emit('input', color)
      this.show = false
    },
    getColorBlock (color) {
      return `<i data-color="${color}" style="background:${color}"/>`
    }
  }
}
</script>

<style lang="scss">
.color-picker {
  .van-grid-item__content {
    background: transparent;
    padding: 16px;
  }
  .color-series {
    display: flex;
    justify-content: center;
    width: 100%;
    .van-button--small {
      width: inherit;
    }
  }
}

</style>
