<template>
  <div class="edit-transform">
    <div class="field has-addons">
      <div class="control field-lb">
        移动(%)
      </div>
      <div class="field-body transform-xyz">
          <p class="control is-small">
            <input class="input is-small" v-model.number="transform.translate[0]" type="number" placeholder="x">
          </p>
          <p class="control is-small">
            <input class="input is-small" v-model="transform.translate[1]" type="number" placeholder="y">
          </p>
          <p class="control is-small">
            <input class="input is-small" v-model="transform.translate[2]" type="number" placeholder="z">
          </p>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="control field-lb">
        旋转
      </div>
      <div class="field-body transform-xyz">
        <p class="control is-small">
          <input class="input is-small" v-model.number="transform.rotate[0]" type="number" placeholder="x">
        </p>
        <p class="control is-small">
          <input class="input is-small" v-model="transform.rotate[1]" type="number" placeholder="y">
        </p>
        <p class="control is-small">
          <input class="input is-small" v-model="transform.rotate[2]" type="number" placeholder="z">
        </p>
      </div>
    </div>
    <div class="field has-addons" v-if="transform.origin">
			<div class="control field-lb">
				横向
			</div>
      <div class="control">
        <div class="select is-small">
          <select v-model="transform.origin[0]">
            <option v-for="option in transformOffsetX" :value="option.value" :key="option.value">{{option.label}}</option>
          </select>
        </div>
      </div>
			<div class="control field-lb">
				纵向
			</div>
			<div class="control">
				<div class="select is-small">
					<select v-model="transform.origin[1]">
						<option v-for="option in transformOffsetY" :value="option.value" :key="option.value">{{option.label}}</option>
					</select>
				</div>
			</div>
    </div>
    <div class="field has-addons">
			<div class="control field-lb">
				透明度
			</div>
      <div class="control">
         <input class="input is-small" v-model.number="transform.opacity" type="number">
      </div>
      <div class="control">
        <a class="button is-static is-small">%</a>
      </div>
    </div>
    <div class="field has-addons">
			<div class="control field-lb">
				视角
			</div>
      <div class="control">
         <input class="input is-small" v-model.number="transform.psp" type="number">
      </div>
      <div class="control">
        <a class="button is-static is-small">像素</a>
      </div>
    </div>
    <div class="field has-addons">
			<div class="control field-lb">
				缩放
			</div>
      <div class="control">
         <input class="input is-small" v-model.number="transform.scale" type="number">
      </div>
    </div>
</div>
</template>

<script>
export default {
  name: 'EditTransform',
  components: { },
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
    },
    transformOffsetX () {
      return [{
        value: 'left',
        label: '靠左'
      }, {
        value: 'right',
        label: '靠右'
      }, {
        value: 'center',
        label: '居中'
      }]
    },
    transformOffsetY () {
      return [{
        value: 'top',
        label: '靠上'
      }, {
        value: 'bottom',
        label: '靠下'
      }, {
        value: 'center',
        label: '居中'
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
