import { Loading, Message } from 'element-ui'
import ImageDAO from '../../common/dao/imagedao'
import RestDAO from '../../common/dao/restdao'
import { clone } from '../../utils/object'
export default {
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.scenedao = new RestDAO(this.ctx, 'danke/scene')
  },
  methods: {
    async savePage () {
      const loading = Loading.service({
        lock: true,
        text: '正在保存中',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.4)'
      })
      // save scene preview
      await this.saveImages()
      const scene = this.getSceneConfig()
      if (this.$route.params.id === 'new') {
        await this.scenedao.create(scene)
      } else {
        await this.scenedao.patch(this.$route.params.id, scene)
      }
      loading.close()
      Message.success('保存完成')
    },
    async saveImages () {
      for (let url in this.resources) {
        const result = await this.imagedao.uploadBlob(this.resources[url])
        for (let element of this.elements) {
          if (element.url === url) {
            element.url = result.url.replace(/http[s]*:\/\/[^/]+/g, '')
          }
        }
      }
    },
    // extract scene info
    getSceneConfig () {
      const elements = []
      for (let element of this.elements) {
        let cloned = clone(element)
        delete cloned.style
        elements.push(cloned)
      }
      return {
        name: this.scene.name,
        cover: this.scene.cover,
        screen: this.$route.params.screen,
        elements: elements
      }
    }
  }
}
