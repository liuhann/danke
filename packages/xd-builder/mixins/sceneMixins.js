import { MessageBox } from 'element-ui'
import { clone } from '../../utils/object'
import { shortid } from '../../utils/string'
import SCENE from '../../danke-core/elements/scene'
import { getSceneStyle, renderSceneStage } from '../../danke-core/utils/styles'
export default {
  provide () {
    return {
      addNewScene: this.addNewScene,
      chooseScene: this.chooseScene,
      previewScene: this.previewScene,
      deleteCurrentScene: this.deleteCurrentScene
    }
  },
  methods: {
    addNewScene () {
      const scene = clone(SCENE)
      scene.name = '画面 ' + (this.scenes.length + 1)
      scene.id = shortid()
      scene.style = getSceneStyle(scene, this.device)
      this.scenes.push(scene)
      this.currentScene = scene
    },
    chooseScene (scene) {
      this.chooseElement(null)
      this.currentScene = scene
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
      if (this.scenes.length === 1) {
        MessageBox.prompt('无法删除: 请至少保留一个场景')
        return
      }
      MessageBox.confirm('删除场景后不可恢复，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        for (let i = 0; i < this.scenes.length; i++ ) {
          if (this.scenes[i].id === this.currentScene.id) {
            this.scenes.splice(i, 1)
            if (i > 0) {
              this.currentScene = this.scenes[i - 1]
            } else {
              this.currentScene = this.scenes[0]
            }
            break
          }
        }
      })
    }
  }
}