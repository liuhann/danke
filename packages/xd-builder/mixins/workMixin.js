/**
 * 有work属性的组件通用相关方法
 */
import { shortid } from '../../utils/string'
import { Loading, Message } from 'element-ui'
import RestDAO from '../../utils/restdao.js'
import { tidyUpWork } from '../utils/workActions.js'

export default {
  props: {
    viewBox: {
      type: Object
    }
  },
  data () {},
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.previewdao = new RestDAO(this.ctx, 'danke/preview')
    this.styleRegistry = this.ctx.styleRegistry
  },
  methods: {
    slidePreview () {
      window.open('/slide/' + this.work.id)
    },
    
    /**
     * 应用音乐节拍到作品的每个页面
     * @param {Object} tick
     */
    applyTicksToWork (tick) {
      this.work.audioUrl = tick.url
      this.work.audioName = tick.name
      let tickIndex = 0
      let passedSeconds = 0
      for (let scene of this.work.scenes) {
        if (!tick.ticks[tickIndex]) {
          break
        }
        if (!scene.transitionFrame) {
          scene.duration = tick.ticks[tickIndex] - passedSeconds
          tickIndex++
        }
        passedSeconds += scene.duration
      }
    },

    /**
     * 加载作品 并且根据规则重新组织回写一些信息
     * @param {string} workId 作品Id
     */
    async loadWork (workId) {
      const loadingInstance = Loading.service({ fullscreen: true, text: '加载作品中' })
      const work = await this.workdao.getOne(workId)
      this.work = tidyUpWork(work)
      this.scene = this.work.scenes[0]
      loadingInstance.close()
    },

    initSceneSVG (elements, svgs) {
      for (const element of elements) {
        if (element.svg) {
          element.content = svgs[element.svg]
        }
        if (element.mask) {
          element.maskImage = svgs[element.mask]
        }
        if (element.elements) {
          this.initSceneSVG(element.elements, svgs)
        }
      }
    },

    /**
    * 抽取作品里所有元素的样式资源，包括动画、SVG图片及字体
    * @param {*} work
    */
    getCommonResource () {
      const frames = {} // css 帧资源
      const styles = {} // css 样式资源
      const svgs = {}
      const fonts = new Set()
      for (const scene of this.work.scenes) {
        if (!scene.animation) {
          scene.animation = {}
        }
        this.assignSceneResource(scene, frames, svgs, fonts)
      }
      return {
        frames,
        styles,
        svgs,
        fonts: Array.from(fonts)
      }
    },

    assignSceneResource (scene, frames, svgs, fonts) {
      for (const element of scene.elements) {
        element.animation.preview = []

        // when use svg as element content image
        if (element.svg) {
          svgs[element.svg] = element.content
          delete element.content
        }

        // when use svg as element mask image
        if (element.mask) {
          svgs[element.mask] = element.maskImage
          delete element.masksvg
        }

        if (element.variables && element.variables.length) {
          element.variables.forEach(variable => {
            if (variable.type === 'fontFamily') {
              fonts.add(variable.value)
            }
          })
        }
        // assign resource in blocks
        if (element.elements) {
          this.assignSceneResource(element, frames, svgs, fonts)
        }
      }
    },

    /**
     * 保存作品内容
     */
    async saveWork () {
      if (this.savingWork) {
        return
      }
      this.savingWork = true
      const work = JSON.parse(JSON.stringify(this.work))
      work.creator = this.ctx.user.id
      work.avatar = this.ctx.user.avatar

      work.snapshot = ''
      if (!this.work._id) {
        work.creator = this.ctx.user.id
        const result = await this.workdao.create(work)
        this.work._id = result.object._id
        this.$router.replace(location.pathname + '?work=' + this.work.id)
      } else {
        await this.workdao.patch(work.id, work)
      }
      this.savingWork = false
      // 处理作品的预览
      // 发出请求获取最新的work-preview
      this.ctx.get('/danke/preview/download?id=' + work.id)
    },

    async runWork () {
      await this.saveWork()
      window.open('/play/fit/' + this.work._id)
    },

    addScene () {
      const scene = {
        name: '场景',
        id: shortid(),
        elements: [],
        animation: {},
        color: '',
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
      this.scene = scene
    },

    chooseScene (scene) {
      this.scene = scene
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
    }
  }
}
