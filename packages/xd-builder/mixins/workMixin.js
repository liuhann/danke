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
    this.styleRegistry = this.ctx.styleRegistry
  },
  methods: {
    slidePreview () {
      window.open('/slide/' + this.work.id)
    },
    /**
     * 新增作品
     */
    newWork () {
      return {
        id: shortid(10),
        title: '未命名的作品',
        isBlock: 'no',
        viewBox: this.viewBox || {
          width: 1080,
          height: 1920
        },
        color: '#fff',
        audioUrl: '',
        audioName: '',
        audioSeconds: 0,
        frames: {}, // 动画信息
        svgs: {}, // svg图片信息
        fonts: {},// 字体列表
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
      this.ctx.styleRegistry.initWorkStyleResource(work)
      this.ctx.palette = this.ctx.styleRegistry.getWorkColors(work)

      for (let scene of work.scenes) {
        scene.visible = false
        scene.stage = ''
      }
      this.work = work
      loadingInstance1.close()
    },

    /**
     * 获取、初始化作品里所有元素的样式资源
     */
    initWorkStyleResource (work) {
      const styleRegistry = this.ctx.styleRegistry
      for (let name in work.frames) {
        styleRegistry.addFrame({
          name,
          cssFrame: work.frames[name]
        })
      }
      for (let name in work.styles) {
        styleRegistry.addStyle({
          name,
          cssContent: work.styles[name]
        })
      }
      if (work.fonts && work.fonts.length) {
        for (let font of work.fonts) {
          styleRegistry.addFontFace(font)
        }
      }
      // init element svg content from work.svgs
      for (let scene of work.scenes) {
        this.initSceneSVG(scene.elements, work.svgs)
      }
    },

    /**
    * 抽取作品里所有元素的样式资源，包括动画、SVG图片及字体
    * @param {*} work
    */
    getCommonResource() {
      const frames = {} // css 帧资源
      const styles = {} // css 样式资源
      const svgs = {}
      const fonts = new Set()
      for (let scene of work.scenes) {
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
      for (let element of scene.elements) {
        for (let stage in element.animation) {
          for (let animation of element.animation[stage]) {
            frames[animation.name] = this.keyframes[animation.name]
          }
        }

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
      let loadingInstance = Loading.service({ fullscreen: true, text: '保存作品中' });
      const work = JSON.parse(JSON.stringify(this.work))
      // 抽取所有使用的frame style到work上，以便压缩使用空间
      Object.assign(work, this.ctx.styleRegistry.getStyleResource(work))
      work.colors = this.getWorkColors(work)
      work.author = this.ctx.user.nick
      work.avatar = this.ctx.user.avatar
      this.savingWork = true
      if (!this.work._id) {
        const result = await this.workdao.create(work)
        this.work._id = result.object._id
        this.$router.replace('/xd?work=' + this.work.id)
      } else {
        await this.workdao.patch(work._id, work)
      }
      this.savingWork = false
      loadingInstance.close()
      Message.success({
        message: '作品已经保存',
        duration: 800
      })
    },

    async runWork () {
      await this.saveWork()
      window.open('/play/fit/' + this.work._id)
    }
  }
}
