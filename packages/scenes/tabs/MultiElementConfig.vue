<template>
<div class="prop-config">
  <form-field label="横向对齐" type="radio" v-model="horizontal" :options="horizontalOptions">
  </form-field>
  <edit-len label="横向偏移" v-model="offsetX"></edit-len>
  <form-field label="递增" type="number" width="60px" v-model="deltaX">
    <span class="button is-small is-info" @click="batchSet('positionX')">批量设置</span>
  </form-field>
  <form-field label="纵向对齐" type="radio" v-model="vertical" :options="verticalOptions"></form-field>
  <edit-len label="纵向偏移" v-model="offsetY"></edit-len>
  <form-field label="递增" type="number" width="60px" v-model="deltaY">
    <span class="button is-small is-info" @click="batchSet('positionY')">批量设置</span>
  </form-field>

  <form-field label="动画设置" type="radio" v-model="animationType" :options="animationOptions">
  </form-field>
  <form-field label="动画">
    <span class="button is-small" @click="chooseAnimation(animationType)">{{animation.desc || '选择'}}</span>
    <span v-if="animation.name" class="button is-small icon-trash" @click="clearAnimation"></span>
  </form-field>
  <edit-len label="时长" v-model="animation.duration" :with-unit="false"></edit-len>
  <form-field label="递增" type="number" width="60px" v-model="animation.deltaDuration">
    <span class="button is-small is-info" @click="batchSet('deltaDuration')">批量设置</span>
  </form-field>
  <edit-len label="延迟" v-model="animation.delay" :with-unit="false"></edit-len>
  <form-field label="递增" type="number" width="60px" v-model="animation.deltaDelay">
    <span class="button is-small is-info" @click="batchSet('deltaDelay')">批量设置</span>
  </form-field>

</div>
</template>

<script>
import { horizontalOptions, verticalOptions } from '../../danke-core/css-model/position'
import EditLen from '../components/EditLen.vue'
import FormField from '../../common/components/FormField.vue'
import { getLengthDelta } from '../../danke-core/utils/common'
import { getElementStyle } from '../../danke-core/utils/styles'
import frameModel from '../../frames/frameChooseDialog'

export default {
  name: 'MultiElementConfig',
  components: { FormField, EditLen },
  props: {
    elements: {
      type: Array
    },
    device: {
      type: Object
    }
  },
  data () {
    return {
      horizontal: '',
      vertical: '',
      offsetX: '0vw',
      deltaX: 0,
      offsetY: '0vh',
      deltaY: 0,
      horizontalOptions,
      verticalOptions,
      animationType: 'in',
      animation: {
        deltaDuration: 0,
        deltaDelay: 0,
        duration: 0,
        delay: 0,
        desc: '',
        name: ''
      },
      animationOptions: [{
        key: 'in',
        value: '进入'
      }, {
        key: 'dura',
        value: '持续'
      }, {
        key: 'out',
        value: '离开'
      }]
    }
  },
  watch: {
    elements () {
    }
  },
  methods: {
    clearAnimation () {
      this.animation.name = ''
      this.animation.desc = ''
      for (let element of this.elements) {
        element.animation[this.animationType].name = ''
        element.animation[this.animationType].desc = ''
        element.animation[this.animationType].timing = ''
        element.animation[this.animationType].frames = []
      }
    },
    chooseAnimation (type) {
      frameModel.choose(type, (animation) => {
        this.animation.name = animation.name
        this.animation.desc = animation.desc
        if (!this.animation.duration) {
          this.animation.duration = animation.duration
        }
        if (!this.animation.delay) {
          this.animation.delay = animation.delay
        }
        this.animation.timing = animation.timing
        this.animation.frames = animation.frames

        for (let element of this.elements) {
          element.animation[this.animationType].name = animation.name
          element.animation[this.animationType].desc = animation.desc
          element.animation[this.animationType].timing = animation.timing
          element.animation[this.animationType].frames = animation.frames
        }
      })
    },
    batchSet (unit) {
      let i = 0
      for (let element of this.elements) {
        if (unit === 'positionX') {
          element.position.horizontal = this.horizontal
          element.position.offsetX = getLengthDelta(this.offsetX, i * this.deltaX)
        }
        if (unit === 'positionY') {
          element.position.vertical = this.vertical
          element.position.offsetY = getLengthDelta(this.offsetY, i * this.deltaY)
        }
        if (unit === 'deltaDuration') {
          element.animation[this.animationType].duration = this.animation.duration + i * this.animation.deltaDuration
        }
        if (unit === 'deltaDelay') {
          element.animation[this.animationType].delay = this.animation.delay + i * this.animation.deltaDelay
        }
        i++
        element.style = getElementStyle(element, this.device)
      }
    }
  }
}
</script>

<style scoped>

</style>
