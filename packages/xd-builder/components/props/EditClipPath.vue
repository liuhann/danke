<template>
  <div class="edit-clip-path">
    <div class="field has-addons">
      <div class="control icon-label">
        <img class="svg-icon" :src="SVG_CROP">
      </div>
      <div class="control">
        <div class="select is-small">
          <select v-model="clip.type">
            <option v-for="option in clipTypes" :value="option.key" :key="option.key">{{option.value}}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="field is-horizontal clip-path-point" v-for="(point, index) of clip.points" :key="index">
      <div class="control order">
        {{index+1}}.
      </div>
      <div class="control">
         <input class="input is-small" v-model.number="point[0]" type="number">
      </div>
      <div class="control">
         <input class="input is-small" v-model.number="point[1]" type="number">
      </div>
      <p class="control is-small">
        <a class="icon-trash-empty" @click="removePoint(index)"></a>
      </p>
    </div>
    <div class="field has-addons" v-if="clip.type === 'polygon'">
      <p class="control order">
      </p>
      <p class="control">
        <a class="icon-plus-1" @click="addPoint">增加点</a>
      </p>
    </div>
  </div>
</template>

<script>
import SVG_CROP from '../../svg/crop.svg'
import FormField from './FormField'
export default {
  name: 'EditClipPath',
  components: { FormField },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      SVG_CROP,
      clipTypes: [{
        key: 'none',
        value: '无'
      }, {
        key: 'polygon',
        value: '多边形'
      }, {
        key: 'ellipse',
        value: '圆'
      }],
      clip: this.value
    }
  },
  created () {},
  watch: {
    value () {
      this.clip = this.value
    },
    'clip.type': function () {
      this.clipTypeChange()
    },
    clip: {
      handler: function (val, oldVal) {
        this.$emit('input', this.clip)
      },
      deep: true
    }
  },
  methods: {
    clipTypeChange () {
      if (this.clip.type === 'polygon') {
        this.$set(this.clip, 'points', [[0, 0], [100, 0], [100, 100], [0, 100]])
        // this.clip.points =
      } else if (this.clip.type === 'ellipse') {
        this.$set(this.clip, 'points', [[50, 50], [50, 50]])
      } else {
        this.$set(this.clip, 'points', [])
      }
    },

    removePoint (index) {
      this.clip.points.splice(index, 1)
    },

    addPoint () {
      this.clip.points.push([50, 50])
    }
  }
}
</script>

<style lang="scss">
.edit-clip-path {
  font-size: 1em;
  .order {
    width: 40px;
    text-align: right;
    padding-right: 10px;
  }
  margin-top: .5rem;
  .clip-path-point {
		flex: 1;
		.field-body {
			display: flex;
			.field {
				margin: 0;
			}
			input {
				width: 80px;
				margin-right: 5px;
			}
		}
	}
}
</style>
