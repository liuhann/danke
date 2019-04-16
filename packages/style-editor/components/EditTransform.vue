<template>
  <div class="edit-transform">
    <div class="field is-horizontal">
      <div class="field-label is-small">
        <label class="label">移动(%)</label>
      </div>
      <div class="field-body transform-xyz">
        <div class="field">
          <p class="control is-small">
            <input class="input is-small" v-model.number="transform.translate[0]" type="number" placeholder="x">
          </p>
        </div>
        <div class="field">
          <p class="control is-small">
            <input class="input is-small" v-model="transform.translate[1]" type="number" placeholder="y">
          </p>
        </div>
        <div class="field">
          <p class="control is-small">
            <input class="input is-small" v-model="transform.translate[2]" type="number" placeholder="z">
          </p>
        </div>
      </div>
    </div>
		<div class="field is-horizontal">
			<div class="field-label is-small">
				<label class="label">旋转</label>
			</div>
			<div class="field-body transform-xyz">
				<div class="field">
					<p class="control is-small">
						<input class="input is-small" v-model.number="transform.rotate[0]" type="number" placeholder="x">
					</p>
				</div>
				<div class="field">
					<p class="control is-small">
						<input class="input is-small" v-model="transform.rotate[1]" type="number" placeholder="y">
					</p>
				</div>
				<div class="field">
					<p class="control is-small">
						<input class="input is-small" v-model="transform.rotate[2]" type="number" placeholder="z">
					</p>
				</div>
			</div>
		</div>
		<form-field v-model.number="transform.opacity" label="透明度" type="number" width="70px" unit="%"></form-field>
		<form-field v-model.number="transform.scale" label="缩放" type="number" width="70px" unit="%">
		</form-field>
</div>
</template>

<script>
import EditLen from './EditLen'
import FormField from '../../common/FormField'
export default {
  name: 'EditTransform',
  components: {FormField, EditLen },
  props: {
    value: {
      type: Object
    }
  },
  data () {
    return {
      transform: this.value
    }
  },
  watch: {
    value () {
      this.transform = this.value
    },
    transform: {
      deep: true,
      handler: function () {
        this.$emit('input', this.transform)
      }
    }
  },
  computed: {
    translateUnit () {
      return [{
        value: '%',
        label: '百分比'
      }, {
        value: 'px',
        label: '像素'
      }]
    },
    rotateUnit () {
      return [{
        value: 'deg',
        label: '度'
      }]
    }
  }
}
</script>

<style lang="scss">
.transform-xyz {
	display: flex;
	.field {
		margin: 0;
	}
	input {
		margin-right: 5px;
		width: 70px;
	}
}
</style>
