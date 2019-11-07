import { clone } from '../../utils/object'
import { shortid } from '../../utils/string'
import SCENE from '../../danke-core/elements/scene'
import { getElementInnerStyle, getElementStyle, getSceneStyle, renderSceneStage } from '../../danke-core/utils/styles'
import { MessageBox } from 'element-ui'
export default {
  provide () {
    return {
      nextScene: this.nextScene,
      copyScene: this.copyScene,
      previousScene: this.previousScene
    }
  },
  watch: {
    'currentScene.background': {
      deep: true,
      handler () {
        this.currentScene.style = getSceneStyle(this.currentScene, this.device)
      }
    }
  },
  methods: {
    addNewScene () {
      const scene = clone(SCENE)
      scene.name = '场景 ' + (this.work.scenes.length + 1)
      scene.id = shortid()
      scene.background.colors = ['rgba(0,0,0,0)']
      scene.style = getSceneStyle(scene, this.device)
      this.work.scenes.push(scene)
      this.chooseScene(scene)
    },
    chooseScene (scene, index) {
      this.chooseElement(null)
      this.currentScene = scene
    },
    nextScene () {
      if (this.ticksEditing) {
        this.work.audioTicks.push(this.audio.currentTime)
      }
      for (let i = 0; i < this.work.scenes.length; i++) {
        if (this.currentScene === this.work.scenes[i]) {
          if (i < this.work.scenes.length - 1) {
            this.chooseScene(this.work.scenes[i + 1], i + 1)
            this.renderScene(this.work.scenes[i + 1], 'in')
            this.renderScene(this.work.scenes[i], 'out')
            break
          }
        }
      }
    },
    renderScene (scene, stage) {
      for (let element of scene.elements) {
        element.style = getElementStyle(element, this.device, stage)
        element.innerStyle = getElementInnerStyle(element, this.device, stage)
      }
    },
    previousScene () {
      for (let i = 0; i < this.work.scenes.length; i++) {
        if (this.currentScene === this.work.scenes[i]) {
          if (i > 0) {
            this.chooseScene(this.work.scenes[i - 1])
            this.renderScene(this.work.scenes[i - 1], 'in')
            this.renderScene(this.work.scenes[i], 'out')
            break
          }
        }
      }
    },

    /**
     * 编辑场景切换节拍
     * @returns {Promise<void>}
     */
    async editTicking () {
      const that = this
      MessageBox.alert('播放音乐时手动点击”下一页“切换场景，当前播放时间会自动附着到场景切换之上', '编辑节拍', {
        confirmButtonText: '确定',
        callback: async action => {
          if (!that.ticksEditing) {
            this.chooseScene(this.work.scenes[0])
            that.ticksEditing = true
            that.work.audioTicks = []
            if (that.work.audioUrl) {
              that.audio = new Audio('http://image.danke.fun/' + that.work.audioUrl)
              const playPromise = that.audio.play()
              if (playPromise !== undefined) {
                await playPromise
              }
              this.audio.onended = async function () {
                that.ticksEditing = false
                that.applyWorkTicksToScenes()
              }
            }
          } else {
            that.ticksEditing = false
            if (this.audio) {
              that.audio.pause()
            }
          }
        }
      })
    },
    applyWorkTicksToScenes () {
      let last = 0
      if (this.work.audioTicks) {
        for (let i = 0; i < this.work.audioTicks.length; i++) {
          if (this.work.scenes[i]) {
            this.work.scenes[i].leave = Math.floor(this.work.audioTicks[i] * 1000) - last
            last = Math.floor(this.work.audioTicks[i] * 1000)
          }
        }
      }
    }
  }
}
