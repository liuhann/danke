import ModelChooseFrame from './ModelChooseFrame.vue'
import Vue from 'vue'

let modelInstance = null

export default {
  choose (type, cb) {
    if (!modelInstance) {
      const div = document.createElement('div')
      div.id = 'modelChooseFrame'
      document.body.appendChild(div)
      modelInstance = new Vue(ModelChooseFrame).$mount('#modelChooseFrame')
    }
    modelInstance.chooseFrame(type, cb)
  }
}
