<template>
  <div class="framed-player">
    <div v-if="work" class="work-container">
      <div class="device" :style="deviceStyle">
        <render-scene :scene="work.scenes[0]" stage="enter" :view-port="work.viewBox" :view-box="work.viewBox" />
        <render-scene v-for="(scene, index) in work.scenes" v-show="scene.visible" :key="index" :scene="scene" :stage="scene.stage" :view-port="viewPort" :view-box="work.viewBox" />
      </div>
    </div>
  </div>
</template>

<script>
import RenderScene from '../xd-builder/render/RenderScene'
import RestDAO from '../utils/restdao'
export default {
  name: "FramedPlayer",
  data () {
    return {
      work: null
    }
  },
  computed: {
    deviceStyle () {
      return {
        width: this.work.viewBox.width + 'px',
        height: this.work.viewBox.height + 'px'
      }
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },
  mounted () {
    this.onLoaded()
  },
  methods: {
    async onLoaded () {
      const work = await this.workdao.getOne(this.$route.params.id)
      this.work = work
      this.scene = this.work.scenes[0]
    }
  }
}
</script>

<style lang="scss">

</style>
