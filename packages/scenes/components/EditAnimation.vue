<template>
<div class="edit-animation-option panel">
  <form-field label="选择" type="empty">
    <span class="button is-small" @click="chooseAnimation(animationType)">{{animation.desc || '选择'}}</span>
    <span v-if="animation.name" class="button is-small icon-trash is-danger" @click="clearAnimation"></span>
  </form-field>
  <form-field label="时长" type="empty">
    <edit-len v-model="animation.duration" :with-unit="false"></edit-len>
  </form-field>

  <form-field label="延迟" type="empty">
    <edit-len v-model="animation.delay" :with-unit="false"></edit-len>
  </form-field>
</div>
</template>

<script>
import EditLen from './EditLen.vue'
import FormField from '../../common/components/FormField'
import frameModel from '../../frames/frameChooseDialog'
export default {
  name: 'EditAnimation',
  components: {
    FormField,
    EditLen
  },
  props: {
    label: {
      type: String
    },
    animation: {
      type: Object
    },
    value: {
      type: Object
    },
    animations: {
      type: Array
    },
    animationType: {
      type: String
    }
  },
  data () {
    return {
    }
  },
  computed: {
    font () {
      return this.value
    }
  },

  watch: {
    font () {
      this.$emit('input', this.font)
    }
  },
  methods: {
    clearAnimation () {
      this.animation.name = ''
      this.animation.desc = ''
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
      })
    }
  }
}
</script>

<style>

</style>
