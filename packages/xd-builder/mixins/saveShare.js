/**
 * 保存加载相关处理
 */
import { Loading, Message } from 'element-ui'
import { intereactWith } from '../utils/interact'
import ImageDAO from '../../common/dao/imagedao'
import RestDAO from '../../common/dao/restdao'
import { clone } from '../../utils/object'
import is from '../../utils/is'
import { shortid } from '../../utils/string'
export default {
  provide () {
    return {
      saveWork: this.saveWork,
      openWorkListDialog: this.openWorkListDialog,
      openEditWorkDialog: this.openEditWorkDialog,
      editWork: this.editWork
    }
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },
  mounted () {
    const work = this.$route.query.work
    const ratio = this.$route.query.ratio
    if (work === 'new') {
      this.newWork(ratio)
    } else {
      this.fetchWork(work)
    }
  },
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
      this.zoomCenter()
      this.addNewScene()
      if (this.interactEnabled) {
        this.$nextTick(() => {
          intereactWith(this.$refs.deviceDrag, this.$refs.device)
        })
      }
    },
    async fetchWork (workId) {
      const work = await this.workdao.getOne(workId)
      this.openWork(work)
    },
    editWork () {
    },
    async saveWork () {
      this.hideLeftToggleMenu()
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
      // work.cover = await this.saveCover()
      work.isDraft = true
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
      this.work.scenes = work.scenes
      this.work.id = work.id
      this.work._id = work._id
      this.work.isNew = false
      this.work.title = work.title
      this.work.ratio = work.ratio
      this.work.categories = work.categories
      if (is.str(work.categories)) {
        this.work.categories = this.work.categories.split(',')
      }
      this.work.desc = work.desc
      this.currentScene = this.work.scenes[0]
      this.currentElement = null
      this.zoomCenter()
      this.reflow(work.scenes)
      this.$nextTick(() => {
        intereactWith(this.$refs.deviceDrag, this.$refs.device)
      })
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
    async saveCover () {
      const html2Canvas = (await import(/* webpackChunkName: "html2canvas" */'html2canvas/dist/html2canvas.esm.js')).default
      const previewBlob = await this.getCanvasBlob(await html2Canvas(this.$refs.device, {
        allowTaint: true,
        useCORS: true
      }))
      const previewUpload = await this.imagedao.uploadBlob(previewBlob)
      return previewUpload.url.replace(/http[s]*:\/\/[^/]+/g, '')
    },
    // extract work info
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
    openWorkListDialog () {
      this.hideLeftToggleMenu()
      this.$refs.dialogWorkList.open()
    },
    // open dialog and edit work title
    openEditWorkDialog () {
      this.hideLeftToggleMenu()
      this.$refs.dialogEditWork.open(this.work)
    },
    // save work title & desc
    saveWorkDesc (work) {
      this.work.title = work.title
      this.work.categories = work.categories
      this.work.desc = work.desc
    }
  }
}
