/**
 * 有work属性的组件通用相关方法
 */
import { shortid } from '../../utils/string'
import { Loading, Message } from 'element-ui'
import RestDAO from '../../utils/restdao.js'

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
     * 新增作品
     */
    newWork (size) {
      return {
        id: shortid(10),
        title: '我的作品',
        viewBox: size || {
          width: 1080,
          height: 1920
        },
        color: '#fff',
        audioUrl: '',
        audioName: '',
        audioSeconds: 0,
        scenes: [] // 场景
      }
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
      let loadingInstance1 = Loading.service({ fullscreen: true, text: '加载作品中' })
      const work = await this.workdao.getOne(workId)
      if (!work.viewBox) {
        work.viewBox = work.screen
        delete work.screen
      }
      await this.initWorkStyleResource(work)

      for (const scene of work.scenes) {
        scene.visible = false
        scene.stage = ''
      }
      this.work = work
      loadingInstance1.close()
    },

    /**
     * 获取、初始化作品里所有元素的样式资源
     */
    async initWorkStyleResource (work) {
      const styleRegistry = this.ctx.styleRegistry
      if (work.fonts && work.fonts.length) {
        for (const font of work.fonts) {
          await styleRegistry.addFontFace(font)
        }
      }
      // init element svg content from work.svgs
      for (const scene of work.scenes) {
        // this.initSceneSVG(scene.elements, work.svgs)

        for (const element of scene.elements) {
          // 脏数据处理
          element.animation.preview = []
          if (!element.animation.enter) {
            element.animation.enter = []
          }
          if (!element.animation.exit) {
            element.animation.exit = []
          }
        }
      }
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
      let loadingInstance = Loading.service({ fullscreen: true, text: '保存作品中' });
      const work = JSON.parse(JSON.stringify(this.work))
      work.creator = this.ctx.user.id
      work.avatar = this.ctx.user.avatar

      work.snapshot = ''
      if (!this.work._id) {
        work.creator = this.ctx.user.id
        const result = await this.workdao.create(work)
        this.work._id = result.object._id
        this.$router.replace('/xd?work=' + this.work.id)
      } else {
        await this.workdao.patch(work.id, work)
      }
      this.savingWork = false
      loadingInstance.close()
      Message.success({
        message: '作品已经保存',
        duration: 800
      })
      // 处理作品的预览
      // 发出请求获取最新的work-preview
      this.ctx.get('/danke/preview/download?id=' + work.id)
    },

    async runWork () {
      await this.saveWork()
      window.open('/play/fit/' + this.work._id)
    }
  }
}
