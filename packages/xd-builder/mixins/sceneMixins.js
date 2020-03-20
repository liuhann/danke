import { shortid } from '../../utils/string'
import { MessageBox } from 'element-ui'
import { dura } from '../../frames/model/animation-type'
export default {
  data () {
    return {
      currentScene: null,
      lastScene: null,
    }
  },
  methods: {
    /**
     * 增加新的场景
     */
    addScene () {
      const scene = {
        id: shortid(),
        elements: [],
        style: {
          backgroundColor: 'transparent'
        },
        animation: {},
        z: 100
      }
      this.insertScene(scene)
    },

    insertScene(scene) {
      if (this.currentScene) {
        const currentSceneIndex = this.work.scenes.indexOf(this.currentScene)
        this.work.scenes.splice(currentSceneIndex + 1, 0, scene)
      } else {
        this.work.scenes.push(scene)
      }
      this.currentScene = scene
    },

    cloneScene (scene) {
      const newScene = JSON.parse(JSON.stringify(scene))
      newScene.id = shortid()
      this.chooseScene(scene)
    },

    // 切换到下一场景
    nextScene () {
      if (this.ticksEditing) {
        this.work.audioTicks.push(this.audio.currentTime)
      }
      if (this.currentScene) {
        const currrentSceneIndex = this.work.scenes.indexOf(this.currentScene)
        if (currrentSceneIndex < this.work.scenes.length - 1) {
          let duration = this.getSceneExistDuration()
          this.lastScene = this.currentScene
          setTimeout(() => {
            this.lastScene = null
          }, duration)
          this.currentScene = this.work.scenes[currrentSceneIndex + 1]
        }
      }
    },

    // 切换到上一场景
    previousScene () {
      if (this.currentScene) {
        const currrentSceneIndex = this.work.scenes.indexOf(this.currentScene)
        if (currrentSceneIndex > 0) {
          this.currentScene = this.work.scenes[currrentSceneIndex - 1]
        }
      }
    },

    getSceneExistDuration () {
      let maxExistsMill = 1
      for (let element of this.currentScene.elements) {
        if (element.style.exists) {
          for (let exist of element.style.exists) {
            const existMill = exist.delay + exist.dura
            if (existMill > maxExistsMill) {
              maxExistsMill = existMill
            }
          }
        }
      }
      return maxExistsMill
    },

    /**
     * 删除当前场景
     */
    deleteCurrentScene () {
      if (this.scenes.length === 1) {
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
