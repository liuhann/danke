<template>
<div class="field has-addons">
  <div class="control icon-label" @click="copyAnimationStyle">
    <i :class="icon"></i>
  </div>
  <div class="control">
    <span class="button is-small" @click="chooseAnimation(animationType)">{{animation.desc || '选择'}}</span>
  </div>
  <div class="control">
    <edit-len v-model="animation.duration" :with-unit="false"></edit-len>
  </div>
  <div class="control">
    <edit-len v-model="animation.delay" :with-unit="false"></edit-len>
  </div>
  <div class="control">
    <span v-if="animation.name" class="button is-small icon-trash-empty is-danger" @click="clearAnimation"></span>
  </div>
  <div v-if="copied" class="control paste" @click="pasteStyle">
    <i class="icon-paste"></i>
  </div>
</div>
</template>

<script>
import EditLen from './EditLen.vue'
import FormField from './FormField'
import frameModel from '../../../frames/frameChooseDialog'
import pastable from './pastable'
export default {
  name: 'EditAnimation',
  mixins: [pastable],
  components: {
    FormField,
    EditLen
  },
  props: {
    icon: {
      type: String
    },
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
      ctxKey: this.animationType + 'aniCopied',
      propKey: this.animationType + 'ani'
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
    },
    copyAnimationStyle () {
      this.copied = {
        animation: JSON.parse(JSON.stringify(this.animation))
      }
      this.ctx[this.animationType + 'aniCopied'] = this.copied
    }
  }
}
</script>

<style>

</style>
