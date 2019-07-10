import { Loading, Message } from 'element-ui'
import ImageDAO from '../../common/dao/imagedao'
import RestDAO from '../../common/dao/restdao'
import { clone } from '../../utils/object'
export default {
  inject: ['hideLeftToggleMenu'],
  provide () {
    return {
      saveWork: this.saveWork,
      openWorkListDialog: this.openWorkListDialog
    }
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },
  methods: {
    async saveWork () {
      const loading = Loading.service({
        lock: true,
        text: '正在保存中',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.4)'
      })
      // save scene preview
      await this.saveImages()
      const work = this.getWorkConfig()
      work.isDraft = true
      if (this.work.isNew) {
        delete this.work.isNew
        await this.workdao.create(work)
      } else {
        await this.workdao.patch(work._id, work)
      }
      loading.close()
      Message.success('保存完成')
    },
    openWork (o) {
      const work = clone(o)
      this.reflow(work.scenes)
      this.scenes = work.scenes
      this.work.id = work.id
      this.work._id = work._id
      this.work.isNew = false
      this.work.title = work.title
      this.work.categories = work.categories
      this.work.desc = work.desc
      this.currentScene = this.scenes[0]
      this.currentElement = null
    },
    async saveImages () {
      for (let url in this.resources) {
        const result = await this.imagedao.uploadBlob(this.resources[url], this.work.id)
        for (let scene of this.scenes) {
          for (let element of scene.elements) {
            if (element.url === url) {
              element.imgPath = result.name
              break
            }
          }
        }
      }
    },
    // extract work info
    getWorkConfig () {
      const work = Object.assign({}, this.work)
      work.scenes = clone(this.scenes)
      for (let scene of work.scenes) {
        for (let element of scene.elements) {
          delete element.style
        }
        delete scene.style
      }
      work.ratio = this.ratio
      return work
    },
    openWorkListDialog () {
      this.hideLeftToggleMenu()
      this.$refs.dialogWorkList.open()
    }
  }
}
