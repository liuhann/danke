import { TypeEnum } from '../../danke-core/elements/index'
export default {
  data () {
    return {
      // 作品概要信息
      work: {
        ratio: '',
        id: '',
        title: '',
        categories: [],
        desc: '',
        audios: [],
        resources: [],
        scenes: []
      },
      currentScene: {},
      currentElement: null,
      multipleElements: [],
      TypeEnum,
      showLeftToggleMenu: false,
      showElementsLayer: false,
      playing: false,
      playingWork: null
    }
  },
  provide () {
    return {
      work: this.work,
      showElementsLayer: this.showElementsLayer,
      multipleElements: this.multipleElements,
      currentElement: this.currentElement,
      currentScene: this.currentScene,
      // provide methods
      hideLeftToggleMenu: this.hideLeftToggleMenu,
      sceneClick: this.sceneClick
    }
  }
}
