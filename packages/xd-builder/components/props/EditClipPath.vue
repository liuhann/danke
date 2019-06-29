<template>
  <div class="edit-clip-path">
    <form-field v-model="clip.type" label="裁切类型" type="select" :options="clipTypes"></form-field>
    <div class="field is-horizontal clip-path-point" v-for="(point, index) of clip.points" :key="index">
      <div class="field-label is-small">
        <label class="label">{{index+1}}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control is-small">
            <input class="input is-small" v-model.number="point[0]" type="number">
          </p>
        </div>
        <div class="field">
          <p class="control is-small">
            <input class="input is-small" v-model.number="point[1]" type="number">
          </p>
        </div>
        <div class="field">
          <p class="control is-small">
            <a class="icon-trash-empty" @click="removePoint(index)"></a>
          </p>
        </div>
      </div>
    </div>

    <div class="field is-horizontal" v-if="clip.type === 'polygon'">
      <div class="field-label is-small">
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control is-small">
            <a class="icon-plus" @click="addPoint"></a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
