import { clone } from '../../utils/object'
import { shortid } from '../../utils/string'
import SCENE from '../../danke-core/elements/scene'
import { getElementInnerStyle, getElementStyle, getSceneStyle } from '../../danke-core/utils/styles'
import { MessageBox } from 'element-ui'
export default {
  watch: {
    'currentScene.background': {
      deep: true,
      handler () {
        if (this.currentScene) {
          this.currentScene.style = getSceneStyle(this.currentScene, this.device)
        }
      }
    }
  },
  methods: {
    /**
     * 增加新的场景
     */
    addNewScene () {
      const scene = clone(SCENE)
      // 设置默认名称与ID
      scene.name = '场景 ' + (this.work.scenes.length + 1)
      scene.id = shortid()
      // 继承使用之前的颜色
      if (this.currentScene) {
        scene.background.colors = this.currentScene.background.colors || ['rgba(0,0,0,0)']
      }
      scene.style = getSceneStyle(scene, this.device)
      this.work.scenes.push(scene)
      this.chooseScene(scene)
    },
    chooseScene (scene, index) {
      if (this.chooseElement) {
        this.chooseElement(null)
      }
      this.currentScene = scene
    },
    nextScene () {
      if (this.ticksEditing) {
        this.work.audioTicks.push(this.audio.currentTime)
      }
      if (this.currentScene) {
        const currrentSceneIndex = this.work.scenes.indexOf(this.currentScene)
        if (currrentSceneIndex < this.work.scenes.length - 1) {
          this.chooseScene(this.work.scenes[currrentSceneIndex + 1])
          this.renderScene(this.work.scenes[currrentSceneIndex + 1], 'in')
          this.renderScene(this.work.scenes[currrentSceneIndex], 'out')
        }
      }
    },
    renderScene (scene, stage) {
      for (let element of scene.elements) {
        if (element.imgPath) {
          element.url = this.ctx.IMG_SERVER + '/' + element.imgPath
        }
        element.style = getElementStyle(element, this.device, stage)
        element.innerStyle = getElementInnerStyle(element, this.device, stage)
      }
    },
    previousScene () {
      if (this.currentScene) {
        const currrentSceneIndex = this.work.scenes.indexOf(this.currentScene)
        if (currrentSceneIndex > 0) {
          this.chooseScene(this.work.scenes[currrentSceneIndex - 1])
          this.renderScene(this.work.scenes[currrentSceneIndex - 1], 'in')
          this.renderScene(this.work.scenes[currrentSceneIndex], 'out')
        }
      }
    },
    /**
     * 删除当前场景
     */
    deleteCurrentScene () {
      if (this.work.scenes.length === 1) {
        MessageBox.prompt('无法删除: 请至少保留一个场景')
        return
      }
      MessageBox.confirm('删除场景后不可恢复，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const sceneIndex = this.work.scenes.indexOf(this.currentScene)
        this.work.scenes.splice(sceneIndex, 1)
        this.currentScene = this.work.scenes[sceneIndex - 1] || this.work.scenes[0]
      })
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
