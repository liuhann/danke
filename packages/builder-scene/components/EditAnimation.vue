<template>
<div class="edit-animation-option panel">
  <nav class="level">{{label}}</nav>
  <form-field label="进入">
    <span class="button is-small" @click="chooseAnimation(animationType)">{{animation.desc || '选择'}}</span>
    <span v-if="animation.name" class="button is-small is-trash-empty" @click="clearAnimation"></span>
  </form-field>
  <edit-len label="时长" v-model="animation.duration" :with-unit="false"></edit-len>
  <edit-len label="延迟" v-model="animation.delay" :with-unit="false"></edit-len>
</div>
</template>

<script>
import EditLen from './EditLen'
import FormField from '../../common/components/FormField'
import frameModel from '../../builder-frame/frameChooseDialog'
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
        this.animation.duration = animation.duration
        this.animation.delay = animation.delay
        this.animation.timing = animation.timing
        this.animation.frames = animation.frames
      })
    }
  }
}
</script>

<style>

</style>
