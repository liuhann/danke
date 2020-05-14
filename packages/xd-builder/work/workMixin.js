/**
 * 保存、加载作品通用方法
 */
import { shortid } from '../../utils/string'
import RestDAO from '../../common/dao/restdao'

export default {
  data () {
    return {
      blockPageNum: 1
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
  },
  methods: {
    slidePreview () {
      window.open('/slide/' + this.work.id)
    },
    /**
     * 新增作品
     */
    newWork () {
      this.work = {
        id: shortid(10),
        title: '未命名的作品',
        viewBox: {
          width: parseInt(this.$route.query.width) || 414,
          height: parseInt(this.$route.query.height) || 896
        },
        color: '#fff',
        play: {
          audio: '',
          ticks: []
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
      if (!work.viewBox) {
        work.viewBox = work.screen
        delete work.screen
      }
      if (!work.play) {
        work.play = {
          audio: '',
          ticks: []
        }
      }
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
      work.colors = this.ctx.styleRegistry.getWorkColors(work)
      work.author = this.ctx.user.nick
      work.avatar = this.ctx.user.avatar
      if (this.savingWork) {
        return
      }
      this.savingWork = true
      if (!this.work._id) {
        const result = await this.workdao.create(work)
        this.work._id = result.object._id
        this.$router.replace('/xd?work=' + this.work.id)
      } else {
        await this.workdao.patch(work._id, work)
      }
      this.savingWork = false
    },

    async runWork () {
      await this.saveWork()
      window.open('/play/fit/' + this.work._id)
    }
  }
}
