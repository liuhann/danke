// 从图片资源中获取颜色插件
import ColorThief from './ColorThief.js'
export default {
  methods: {
    async getPlugin (name) {
      switch (name) {
        case 'ColorThief':
          return import(/* webpackChunkName: "plugin-color-thief" */'./ColorThief.js')
          break
        default:
          return null
      }
    }
  }
}
