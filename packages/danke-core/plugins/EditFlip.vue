<template>
<div class="edit-fliping">
  <edit-image v-model="element.front" @blob="frontUpdated"></edit-image>
  <edit-image v-model="element.back" @blob="frontUpdated"></edit-image>
  <div class="field has-addons">
    <div class="control field-lb">
      方向
    </div>
    <div class="control">
      <el-select v-model="element.rotate">

      </el-select>
    </div>
  </div>
</div>
</template>

<script>
import frameModel from '../../frames/frameChooseDialog'
import cubicBerziers from '../../frames/model/cubic-beziers.js'
import { Select, Option } from 'element-ui'
export default {
  name: 'EditPaperFolding',
  components: {
    Select,
    Option
  },
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
    frontUpdated () {

    },
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
