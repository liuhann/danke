<template>
<div class="edit-paperfolding">
  <div class="field has-addons">
    <div class="control field-lb">
      拆分
    </div>
    <div class="control">
      [<input class="input is-small" style="width: 45px;" type="number" v-model.number="element.folding.split[0]">,
      <input class="input is-small" style="width: 45px;" type="number" v-model.number="element.folding.split[1]">]
    </div>
  </div>
  <div class="field has-addons">
    <div class="control field-lb">
      起始点
    </div>
    <div class="control">
      [<input class="input is-small" style="width: 45px;" type="number" v-model.number="element.folding.from[0]">,
      <input class="input is-small" style="width: 45px;" type="number" v-model.number="element.folding.from[1]">]
    </div>
  </div>
  <div class="field has-addons">
    <div class="control field-lb">
      递增
    </div>
    <div class="control">
      <edit-len v-model.number="element.folding.inc" :with-unit="false"></edit-len>
    </div>
  </div>
</div>
</template>

<script>
import frameModel from '../../frames/frameChooseDialog'
import cubicBerziers from '../../frames/model/cubic-beziers.js'
import EditLen from '../../xd-builder/components/props/EditLen'
export default {
  name: 'EditPaperFolding',
  components: { EditLen },
  props: {
    element: {
      type: Object
    }
  },
  data () {
    return {
      cubicBerziers
    }
  },
  computed: {
    folding () {
      return this.element.folding
    }
  },
  methods: {
    clearAnimation () {
      this.folding.keyframe = ''
    },
    chooseAnimation () {
      frameModel.choose('in', (animation) => {
        this.folding.animation = animation.name
        this.folding.dura = animation.duration
        this.folding.timing = animation.timing
        if (!animation.cssFrame) {
          this.folding.cssFrame = ''
          this.folding.frames = animation.frames
        } else {
          this.animation.cssFrame = animation.cssFrame
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
