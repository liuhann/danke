<template>
<div class="color-picker">
  <div class="picker-sample" :style="{color: value}" @click="isShow = true">
  </div>
  <van-popup v-model="isShow" class="pop-color-picker" position="bottom" :overlay="true" get-container="body">
		<van-nav-bar title="颜色选择" @click-left="isShow = false" @click-right="chooseColor">
			<van-icon name="success" slot="right" />
			<van-icon name="cross" slot="left" />
		</van-nav-bar>
		<van-row class="picker-result" type="flex" justify="center">
			<van-col span="6"><div class="picker-sample" :style="{color}"></div></van-col>
			<van-col span="12"><van-field v-model="color"></van-field></van-col>
		</van-row>
    <div class="color-container-2">
			<edit-len label="红色" :max="255" :min="0" :with-unit="false" v-model="rgba.r"></edit-len>
			<edit-len label="绿色" :max="255" :min="0" :with-unit="false" v-model="rgba.g"></edit-len>
			<edit-len label="蓝色" :max="255" :min="0" :with-unit="false" v-model="rgba.b"></edit-len>
			<edit-len label="透明度" :max="255" :min="0" :with-unit="false" v-model="rgba.a"></edit-len>
      <!--<van-cell title="透明度">
        <van-slider v-model="materialSlider" :step="2"/>
      </van-cell>
      <div v-for="(value, key) in materialColors" :key="key" class="material-color" :style="{backgroundColor: value[stepKey]||value['50']||value}" @click="chooseColor(value)">
      </div>-->
    </div>
  </van-popup>
</div>
</template>

<script>
import materialColors from '../templates/material-colors'
import ItemBlock from './ItemBlock'
import EditLen from './EditLen'

export default {
  name: 'PopColorPicker',
  components: {EditLen, ItemBlock},
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      rgba: {
        r: 0,
				g: 0,
				b: 0,
				a: 100
			},
      materialSlider: 0,
      currentIndex: -1,
      isShow: false,
      materialColors: materialColors,
      color: this.value
    }
  },

	watch: {
    rgba: {
      deep: true,
			handler () {
        this.color = `rgba(${this.rgba.r}, ${this.rgba.g}, ${this.rgba.b}, ${this.rgba.a/100})`
			}
		},
		value () {
      var rgb = this.value.match(/\d+/g);
      if (rgb.length ===4) {
     		this.rgba.r = rgb[0]
     		this.rgba.g = rgb[1]
     		this.rgba.b = rgb[2]
     		this.rgba.a = Math.floor(rgb[3] * 100)
			} else if (this.value.indexOf('#') > -1) {
        const  { r, g, b } = this.hexToRgb(this.value)
        this.rgba.r = r
        this.rgba.g = g
        this.rgba.b = b
        this.rgba.a = 100
			}
		}
	},
  created () {

  },
	mounted () {

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
		hexToRgb (hex) {
  		var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
			hex = hex.replace(shorthandRegex, function(m, r, g, b) {
				return r + r + g + g + b + b;
			});
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			} : null;
		},

    chooseColor () {
      this.isShow = false
      this.$emit('input', this.color)
    }
  }
}
</script>

<style lang="less">
.picker-sample {
	&:before {
		content: '';
		position: absolute;
		display: block;
		width: 100%;
		height: 100%;
		background: currentColor;
	}
	height: 28px;
	position: relative;
	width: 60px;
	background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2' height='2'%3E%3Cpath d='M1,0H0V1H2V2H1' fill='lightgrey'/%3E%3C/svg%3E") left top/contain white;
	box-shadow: 0 0 0 1px silver;
}
.pop-color-picker {
  border-top: 1px solid #efefef;

	.picker-result {
		display: flex;
	}
}


</style>
