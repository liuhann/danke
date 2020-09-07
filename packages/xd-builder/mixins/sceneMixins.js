import { shortid } from '../../utils/string'
export default {
  computed: {
    // 当前唯一选中的元素
    focusedElement () {
      if (this.selectedElements.length === 1) {
        return this.selectedElements[0]
      } else {
        return null
      }
    },
    selectedElements () {
      if (this.currentScene && this.currentScene.elements) {
        return this.currentScene.elements.filter(el => el.selected && !el.locked)
      }
      return []
    }
  },
  data () {
    return {}
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
        delay: 0,
        duration: 3,
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
  }
}
