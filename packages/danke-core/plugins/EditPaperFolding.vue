<template>
<div class="edit-paperfolding">
  <div class="field has-addons">
    <div class="control field-lb">
      动画名称
    </div>
    <div class="control">
      <span class="button is-small" @click="chooseAnimation">{{folding.keyframe || '选择'}}</span>
    </div>
    <div class="control">
      <span v-if="animation.name" class="button is-small icon-trash-empty is-danger" @click="clearAnimation"></span>
    </div>
  </div>

  <div class="field has-addons">
    <div class="control field-lb">
      持续
    </div>
    <div class="control">
      <edit-len v-model="animation.duration" :with-unit="false"></edit-len>
    </div>
    <div class="control field-lb">
      延迟
    </div>
    <div class="control">
      <edit-len v-model="animation.delay" :with-unit="false"></edit-len>
    </div>
  </div>

  <div class="field has-addons">
    <div class="control field-lb">
      缓动
    </div>
    <div class="control">
      <div class="select is-small">
        <select v-model="animation.timing">
          <option v-for="(value, key) in cubicBerziers" :value="value" :key="key">{{key}}</option>
        </select>
      </div>
    </div>
  </div>
  <div class="field has-addons">
    <div class="control field-lb">
      溢出
    </div>
    <div class="control">
      <input type="checkbox" v-model="animation.overflow" />
    </div>
    <div class="control field-lb">
      重复
    </div>
    <div class="control">
      <input type="checkbox" v-model="animation.infinite" />
    </div>
  </div>
</div>
</template>

<script>
import frameModel from '../../frames/frameChooseDialog'
import cubicBerziers from '../../frames/model/cubic-beziers'
export default {
  name: 'EditPaperFolding',
  props: {
    folding: {
      type: Object
    }
  },
  methods: {
    clearAnimation () {
      this.folding.keyframe = ''
    },
    chooseAnimation () {
      frameModel.choose('in', (animation) => {
        this.folding.keyframe = animation.name
        this.folding.dura = animation.duration
        this.folding.timing = animation.timing
        if (!animation.cssFrame) {
          this.animation.cssFrame = ''
          this.animation.frames = animation.frames
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
