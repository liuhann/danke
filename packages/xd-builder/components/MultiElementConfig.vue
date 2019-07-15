<template>
  <nav class="panel multi-element-prop-config is-small" id="multielement-prop-config">
    <p class="panel-heading">
      批量设置
    </p>
    <div class="panel-body">
      <edit-position v-model="position" v-if="position"></edit-position>
      <edit-border v-model="element.border" v-if="element.border"></edit-border>
      <edit-shadow v-model="element.shadow" v-if="element.shadow"></edit-shadow>
      <edit-clip-path v-model="element.clip" v-if="element.clip"></edit-clip-path>
      <hr/>
      <edit-animation :animation="element.animation.in" animation-type="in" :icon="SVG_IN"></edit-animation>
      <edit-animation :animation="element.animation.dura" animation-type="dura" :icon="SVG_DURA"></edit-animation>
      <edit-animation :animation="element.animation.out" animation-type="out" :icon="SVG_OUT"></edit-animation>
      <!--<form-field label="背景大小" type="select" v-css-model="element.background.size" :options="backgroundSizeOptions"></form-field>-->
    </div>
  </nav>
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
      position: null
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
