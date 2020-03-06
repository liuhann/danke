import StyleRegistry from '../utils/StyleRegistry'
import { fitRectIntoBounds } from '../mixins/rectUtils'
export default {
  data () {
    return {
      deviceSize: null,
      work: null
    }
  },
  created () {
    this.ctx.styleRegistry = new StyleRegistry()
  },
  mounted () {
    let workId = this.$route.query.work
    this.loadAndInitDevice(workId)
  },
  methods: {
    async loadAndInitDevice (workId) {
      // 加载作品
      await this.loadWork(workId)
      // 设置显示屏幕大小
      this.deviceSize = fitRectIntoBounds(this.work.screen, {
        width: this.$el.offsetWidth - 20,
        height: this.$el.offsetHeight - 20
      })
    },

    /**
     * 加载作品 并且根据规则重新组织回写一些信息
     * @param {string} workId 作品Id
     */
    async loadWork (workId) {
      const work = await this.workdao.getOne(workId)
      this.ctx.styleRegistry.initWorkStyleResource(work)
      this.work = work
    },

    getContainerSize () {
      return {
        width: 360,
        height: 640
      }
    }

  }
}
