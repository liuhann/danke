import { clone } from '../../utils/object'
import { shortid } from '../../utils/string'
import SCENE from '../../danke-core/elements/scene'
import { getElementInnerStyle, getElementStyle, getSceneStyle, renderSceneStage } from '../../danke-core/utils/styles'
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
    async previewScene () {
      this.zoomCenter()
      await renderSceneStage({
        elements: this.currentScene.elements
      }, this.device, 'in')
      renderSceneStage({
        elements: this.currentScene.elements
      }, this.device, 'dura')
    }
  }
}
