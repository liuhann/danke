<template>
  <div class="color-picker">
    <van-button :color="value" size="small" icon="arrow-down" square @click="show = true" />
    <van-popup
      v-model="show"
      position="bottom"
    >
      <van-picker show-toolbar title="标题" :columns="columns" allow-html @confirm="onConfirm" />
    </van-popup>
  </div>
</template>

<script>

const antColors = [["#fff1f0","#ffccc7","#ffa39e","#ff7875","#ff4d4f","#f5222d","#cf1322","#a8071a","#820014","#5c0011"],
  ["#fff2e8","#ffd8bf","#ffbb96","#ff9c6e","#ff7a45","#fa541c","#d4380d","#ad2102","#871400","#610b00"],
  ["#fff7e6","#ffe7ba","#ffd591","#ffc069","#ffa940","#fa8c16","#d46b08","#ad4e00","#873800","#612500"],
  ["#fffbe6","#fff1b8","#ffe58f","#ffd666","#ffc53d","#faad14","#d48806","#ad6800","#874d00","#613400"],
  ["#feffe6","#ffffb8","#fffb8f","#fff566","#ffec3d","#fadb14","#d4b106","#ad8b00","#876800","#614700"],
  ["#fcffe6","#f4ffb8","#eaff8f","#d3f261","#bae637","#a0d911","#7cb305","#5b8c00","#3f6600","#254000"],
  ["#f6ffed","#d9f7be","#b7eb8f","#95de64","#73d13d","#52c41a","#389e0d","#237804","#135200","#092b00"],
  ["#e6fffb","#b5f5ec","#87e8de","#5cdbd3","#36cfc9","#13c2c2","#08979c","#006d75","#00474f","#002329"],
  ["#e6f7ff","#bae7ff","#91d5ff","#69c0ff","#40a9ff","#1890ff","#096dd9","#0050b3","#003a8c","#002766"],
  ["#f0f5ff","#d6e4ff","#adc6ff","#85a5ff","#597ef7","#2f54eb","#1d39c4","#10239e","#061178","#030852"],
  ["#f9f0ff","#efdbff","#d3adf7","#b37feb","#9254de","#722ed1","#531dab","#391085","#22075e","#120338"],
  ["#fff0f6","#ffd6e7","#ffadd2","#ff85c0","#f759ab","#eb2f96","#c41d7f","#9e1068","#780650","#520339"],
  ["#ffffff","#fafafa","#f5f5f5","#f0f0f0","#d9d9d9","#bfbfbf","#8c8c8c","#595959","#434343","#262626",
  "#1f1f1f","#141414","#000000"]]

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
}]

export default {
  name: 'ColorPicker',
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      columns: this.getColumns(),
      show: false
    }
  },
  methods: {
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
    getColorBlock (color) {
      return `<i data-color="${color}" style="background:${color}"/>`
    }
  }
}
</script>

<style>
.van-grid-item__content {
  padding: 4px;
}
.color-picker .van-picker-column__wrapper .van-ellipsis i {
  width: 20vw;
  display: block;
  height: 36px;
}
</style>
