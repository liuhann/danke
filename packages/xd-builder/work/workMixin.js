/**
 * 保存、加载作品通用方法
 */
import { shortid } from '../../utils/string'
import RestDAO from '../../common/dao/restdao'

export default {
  data () {
    return {
      work: null,
      blockPageNum: 1
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.blockdao = new RestDAO(this.ctx, 'danke/block')
  },
  methods: {
    /**
     * 新增作品
     */
    newWork () {
      this.work = {
        id: shortid(10),
        title: '未命名的作品',
        screen: {
          width: parseInt(this.$route.query.width) || 414,
          height: parseInt(this.$route.query.height) || 896
        },
        frames: {},
        svgs: {},
        fonts: {},
        style: {},
        scenes: []
      }
    },

    /**
     * 加载作品 并且根据规则重新组织回写一些信息
     * @param {string} workId 作品Id
     */
    async loadWork (workId) {
      const work = await this.workdao.getOne(workId)
      this.ctx.styleRegistry.initWorkStyleResource(work)
      this.ctx.palette = this.ctx.styleRegistry.getWorkColors(work)
      this.work = work
    },
    /**
     * 保存作品内容
     */
    async saveWork () {
      const work = JSON.parse(JSON.stringify(this.work))
      // 抽取所有使用的frame style到work上，以便压缩使用空间
      Object.assign(work, this.ctx.styleRegistry.getStyleResource(work))
      const stringify = JSON.stringify(work)
      if (stringify === this.lastStringify) {
        return
      }
      work.colors = this.ctx.styleRegistry.getWorkColors(work)
      this.lastStringify = stringify
      if (this.savingWork) {
        return
      }
      this.savingWork = true
      if (!this.work._id) {
        const result = await this.workdao.create(work)
        this.work._id = result.object._id
      } else {
        await this.workdao.patch(work._id, work)
      }
      this.savingWork = false
    },

    async runWork () {
      await this.saveWork()
      window.open('/play/fit/' + this.work._id)
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
