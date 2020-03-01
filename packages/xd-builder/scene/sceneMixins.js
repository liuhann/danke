import { shortid } from '../../utils/string'
import { getElementInnerStyle, getElementStyle, getSceneStyle } from '../../danke-core/utils/styles'
import { MessageBox } from 'element-ui'
export default {
  methods: {
    /**
     * 增加新的场景
     */
    addNewScene () {
      const scene = {
        elements: [],
        style: {},
        z: 100 // 场景的层次
      }
      // 设置默认名称与ID
      scene.id = shortid()
      const currentSceneIndex = this.work.scenes.indexOf(this.currentScene)
      this.work.scenes.splice(currentSceneIndex + 1, 0, scene)
      this.currentScene = scene
    },

    cloneScene (scene) {
      const newScene = JSON.parse(JSON.stringify(scene))
      newScene.id = shortid()
      const currentSceneIndex = this.work.scenes.indexOf(this.currentScene)
      this.work.scenes.splice(currentSceneIndex + 1, 0, scene)
      this.chooseScene(scene)
    },

    chooseScene (scene, index) {
      this.currentScene = scene
    },

    // 切换到下一场景
    nextScene () {
      if (this.ticksEditing) {
        this.work.audioTicks.push(this.audio.currentTime)
      }
      if (this.currentScene) {
        const currrentSceneIndex = this.work.scenes.indexOf(this.currentScene)
        if (currrentSceneIndex < this.work.scenes.length - 1) {
          this.chooseScene(this.work.scenes[currrentSceneIndex + 1])
        }
      }
    },

    // 切换到上一场景
    previousScene () {
      if (this.currentScene) {
        const currrentSceneIndex = this.work.scenes.indexOf(this.currentScene)
        if (currrentSceneIndex > 0) {
          this.chooseScene(this.work.scenes[currrentSceneIndex - 1])
        }
      }
    },
    /**
     * 渲染当前的场景
     * @param scene
     * @param stage
     */
    renderScene (scene, stage) {
      for (let element of scene.elements) {
        // 图片保存的是相对地址  在渲染时做url转换
        if (element.imgPath) {
          element.url = this.ctx.IMG_SERVER + '/' + element.imgPath
        }
        // 对于svg图片，内容是直接保存到元素上，这里进行blob->url转换
        if (element.svg) {
          let svgBlob = new Blob([element.svg], { type: 'image/svg+xml;charset=utf-8' })
          let domURL = self.URL || self.webkitURL || self
          let url = domURL.createObjectURL(svgBlob)
          element.url = url
        }
        element.style = getElementStyle(element, this.device, stage)
        element.innerStyle = getElementInnerStyle(element, this.device, stage)
      }
      scene.style = getSceneStyle(scene, this.device, 'in')
    },

    /**
     * 重新计算当前场景内所有元素
     */
    invalidate () {
      for (let element of this.currentScene.elements) {
        element.style = getElementStyle(element, this.device, 'in')
        element.innerStyle = getElementInnerStyle(element, this.device, 'in')
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
      if (this.ticksEditing) {
        this.ticksEditing = false
        if (this.audio) {
          that.audio.pause()
        }
      } else {
        MessageBox.alert('播放音乐时手动点击”下一页“切换场景，当前播放时间点会自动附着到场景切换之上。再次点击中止音乐播放', '编辑节拍', {
          confirmButtonText: '确定',
          callback: async action => {
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
          }
        })
      }
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