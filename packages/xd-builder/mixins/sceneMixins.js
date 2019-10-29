import { MessageBox } from 'element-ui'
import { clone } from '../../utils/object'
import { shortid } from '../../utils/string'
import SCENE from '../../danke-core/elements/scene'
import { getElementInnerStyle, getElementStyle, getSceneStyle, renderSceneStage } from '../../danke-core/utils/styles'
export default {
  provide () {
    return {
      addNewScene: this.addNewScene,
      chooseScene: this.chooseScene,
      previewScene: this.previewScene,
      deleteCurrentScene: this.deleteCurrentScene,
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
    copyScene () {
      const scene = clone(this.currentScene)
      scene.name = '场景 ' + (this.work.scenes.length + 1)
      scene.id = shortid()
      scene.style = getSceneStyle(scene, this.device)
      this.work.scenes.push(scene)
      this.chooseScene(scene)
    },
    async previewScene () {
      this.zoomCenter()
      await renderSceneStage({
        elements: this.currentScene.elements
      }, this.device, 'in')
      renderSceneStage({
        elements: this.currentScene.elements
      }, this.device, 'dura')
    },
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
        for (let i = 0; i < this.work.scenes.length; i++) {
          if (this.work.scenes[i].id === this.currentScene.id) {
            this.work.scenes.splice(i, 1)
            if (i > 0) {
              this.currentScene = this.work.scenes[i - 1]
            } else {
              this.currentScene = this.work.scenes[0]
            }
            break
          }
        }
      })
    }
  }
}
