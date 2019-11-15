/**
 * 保存、加载作品通用方法
 */
import { Loading, Message, MessageBox } from 'element-ui'
import { clone } from '../../utils/object'
import { shortid } from '../../utils/string'
export default {
  methods: {
    /**
     * 新增作品
     * @param ratio
     */
    newWork (ratio) {
      this.work.ratio = ratio
      this.work.id = shortid()
      this.work.title = '我的作品'
      this.work.isNew = true
      this.addNewScene()
    },

    async saveWork (isPublish) {
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
      // save scene preview
      await this.saveImages()
      const work = this.getWorkConfig()
      if (this.work.isNew) {
        delete this.work.isNew
        const result = await this.workdao.create(work)
        this.work._id = result.object._id
      } else {
        await this.workdao.patch(work._id, work)
      }
      loading.close()
      Message.success('保存完成')
      this.savingWork = false
    },

    openWork (o) {
      const work = clone(o)
      this.work = work
      this.work.isNew = false
    },

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
      for (let i = 0; i < work.scenes.length; i++) {
        const scene = work.scenes[i]
        for (let element of scene.elements) {
          element.style = ''
        }
        scene.style = ''
      }
      return work
    },


    async runWork () {
      await this.saveWork()
      window.open('/play/fit/' + this.work._id)
    },

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
