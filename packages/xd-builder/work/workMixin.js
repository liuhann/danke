/**
 * 保存、加载作品通用方法
 */
import { Loading, Message, MessageBox } from 'element-ui'
import { shortid } from '../../utils/string'
import ImageDAO from '../utils/imagedao'
import RestDAO from '../../common/dao/restdao'

export default {
  data () {
    return {
      blockPageNum: 1
    }
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.blockdao = new RestDAO(this.ctx, 'danke/block')
  },
  methods: {
    /**
    * 保存作品内容
    */
    async saveWork () {
      if (this.savingWork) {
        return
      }
      this.savingWork = true
      const loading = Loading.service({
        lock: true,
        text: '正在保存中',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.4)'
      })
      const work = this.getWorkConfig()
      if (!this.work._id) {
        const result = await this.workdao.create(work)
        this.work._id = result.object._id
      } else {
        await this.workdao.patch(work._id, work)
      }
      loading.close()
      Message.success('保存完成')
      this.savingWork = false
    },

    /**
     * 打开作品，并且根据规则重新组织回写一些信息
     * @param work 服务器加载的work信息
     */
    openWork (o) {
      const work = JSON.parse(JSON.stringify(o))
      this.ctx.styleRegistry.initWorkStyleResource(work)
      this.work = work
    },

    /**
     * 保存图片，因为上传时只保存了blob在页面端  保存时需要将这些图片上传并回写服务器端的url信息
     * 目前图片都是先上传，再使用
     * @deprecated
     */
    async saveImages () {
      for (let scene of this.work.scenes) {
        for (let element of scene.elements) {
          if (element.blob) {
            const result = await this.imagedao.uploadBlob(element.blob, this.work.id)
            element.imgPath = result.name
            delete element.blob
          }
        }
      }
    },

    /**
     * 获取Work信息
     * @returns {any}
     */
    getWorkConfig () {
      const work = JSON.parse(JSON.stringify(this.work))
      // 抽取所有使用的frame到work上，以便压缩使用空间
      Object.assign(work, this.ctx.styleRegistry.getStyleResource(work))
      return work
    },

    async runWork () {
      await this.saveWork()
      window.open('/play/fit/' + this.work._id)
    },

    /**
    * 保存当前页面的所有元素及其动画为模版
    */
    async saveAsTemplate (targetScene) {
      const scene = JSON.parse(JSON.stringify(targetScene))
      scene.ratio = this.work.ratio
      for (let element of scene.elements) {
        element.style = ''
      }
      scene.style = ''
      scene.frames = this.getSceneElementFrames(scene)
      try {
        await this.blockdao.create(scene)
      } catch (e) {
        console.log(e)
      }
    },

    async loadBlocks () {
      const result = await this.blockdao.list({
        page: this.blockPageNum,
        count: 20
      })
      this.blocks = []
      for (let block of result.list) {
        if (block.frames) {
          this.initSceneElementFrames(block.elements, block.frames)
        }
        const work = {
          cover: block
        }
        this.blocks.push(work)
      }
    },

    /**
     * 恢复元素列表的帧信息, 相当于getSceneElementFrames的反向方法
     * @param scene
     */
    initSceneElementFrames (elements, frames) {
      for (let element of elements) {
        if (element.animations && element.animations.length) {
          for (let animation of element.animations) {
            if (frames[animation.name]) {
              animation.cssFrame = frames[animation.name]
            }
          }
        }
      }
    },

    /**
     * 获取作品里所有元素的样式资源
     * @param {*} work
     */
    getStyleResource (work) {
      const frames = {} // css 帧资源
      const styles = {} // css 样式资源
      for (let scene of work.scenes) {
        for (let element of scene.elements) {
          // 进入动画抽取
          if (element.enters && element.enters.length) {
            for (let animation of element.enters) {
              frames[animation.name] = this.ctx.frameRegistry[animation.name]
            }
          }
          // 离开动画抽取
          if (element.exists && element.exists.length) {
            for (let animation of element.exists) {
              frames[animation.name] = this.ctx.frameRegistry[animation.name]
            }
          }
          // 边框css样式
          if (element.border && element.border.name) {
            styles[element.border.name] = this.ctx.borderStyleRegistry[element.border.name]
          }
        }
      }
      debugger
      return {
        frames,
        styles
      }
    },

    /**
     * 获取场景下所有元素的样式列表
     * @param scene
     * @return object形式的frame列表
     */
    getSceneElementFrames (scene) {
      const frames = {}
      for (let element of scene.elements) {
        if (element.animations && element.animations.length) {
          for (let animation of element.animations) {
            if (!frames[animation.name]) {
              frames[animation.name] = animation.cssFrame
            }
            delete animation.cssFrame
          }
        }
      }
      return frames
    },

    /**
    * 加载通用模板
    */
    async listTemplate () {
      const result = await this.blockdao.list({
        creator: '15011245191'
      })
      return result.list
    },

    /**
     * @deprecated
     */
    async exportWork () {
      const JSZip = (await import(/* webpackChunkName: "jszip" */'jszip')).default
      const { saveAs } = (await import(/* webpackChunkName: "jszip" */'file-saver')).default
      const zip = new JSZip()
      zip.file('work.json', JSON.stringify(this.getWorkConfig()), '\n\r', 2)
      const img = zip.folder('images')
      zip.generateAsync({ type: 'blob' }).then(function (content) {
        // see FileSaver.js
        saveAs(content, 'example.zip')
      })
    }
  }
}
