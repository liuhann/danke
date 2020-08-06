import { shortid } from '../../utils/string'
import { MessageBox } from 'element-ui'
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
        name: '场景',
        id: shortid(),
        elements: [],
        animation: {},
        z: 100,
        duration: 3,
        renderExit: true,
        exit: 1
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

    chooseScene (scene) {
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
