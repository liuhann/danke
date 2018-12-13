import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    currentSceneIndex: -1,
    currentElementIndex: -1,
    scenes: [],
    workConfig: {
    }
  },
  getters: {
    currentScene: state => {
      const scene = state.scenes[state.currentElementIndex]
    },
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  },
  mutations: {
    addEmptyScene (state) {
      state.scenes.push({
        'template': 'designed',
        'hideDelay': 2000,
        'triggerClose': 3000,
        'elements': []
      })
    },

    addElement (state, elementName) {
      state.currentScene.elements.push({
        type: elementName,
        width: '30vw',
        height: '30vh',
        x: '20vw',
        y: '20vh'
      })
    },

    setCurrentElement (state, index) {
      state.currentElementIndex = index
      state.currentElement = state.currentScene.elements[index]
    },

    setCurrentScene (state, index) {
      state.currentScene = state.scenes[index]
    },

    elementChange (state, ) {

    }
  }
})
export default store
