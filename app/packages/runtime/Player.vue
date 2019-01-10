<template>
<div class="danke-runtime">

</div>
</template>

<script>
import Danke from './danke'
export default {
  name: 'Player',

  data () {

  },
  created () {
    const danke = new Danke(this.ctx.loader.work, this.device)
    const updateScene = scene => {
      const data = {}
      const sceneIndex = scene.index
      for (let ei = 0; ei < scene.elements.length; ei++) {
        let element = scene.elements[ei]
        data['scenes[' + sceneIndex + '].elements[' + ei + '].inlineStyle'] = element.elementStyle
        data['scenes[' + sceneIndex + '].elements[' + ei + '].animation'] = element.animation
      }
      data['scenes[' + sceneIndex + '].display'] = scene.display
      data['currentSceneBack'] = scene.style
      console.log('scene update=>', data)
      this.setData(data)
    }

    const hideScene = scene => {
      const data = {}
      data['scenes[' + scene.index + '].display'] = 'none'
      this.setData(data)
    }
    const playEnd = () => {
      this.setData({
        playEnd: true
      })
    }

    danke.sceneEnter(updateScene)
    danke.sceneLeave(updateScene)
    danke.sceneHide(hideScene)
    danke.playEnd(playEnd)

    this.setData({
      scenes: danke.config.scenes
    })

    setTimeout(() => {
      wx.hideLoading()
      danke.begin()
    }, 1000)
  }
}
</script>

<style lang="less">
.danke-runtime {

}
</style>
