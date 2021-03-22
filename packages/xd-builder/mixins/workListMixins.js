import RestDAO from '../../utils/restdao.js'
import StyleRegistry from '../utils/StyleRegistry'
import { fitRectIntoBounds } from './rectUtils'
import { Dialog } from 'vant'
import 'vant/lib/index.css';

export default {
  data () {
    return {
      loading: true,
      page: 1,
      count: 24,
      total: 0,
      works: []
    }
  },
  created () {
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.svgdao = new RestDAO(this.ctx, 'danke/svg')
    this.ctx.styleRegistry = new StyleRegistry()
  },
  methods: {
    listQuery () {
      return {
        creator: this.ctx.user.id
      }
    },

    deleteWork (work) {
      console.log(Dialog)
      Dialog.confirm({
        title: '标题',
        message: '确认删除'
      }).then(async () => {
        await this.workdao.delete(work)
        this.loadWorks()
      })
    },

    viewport () {
      return {
        width: 200,
        height: 200
      }
    },

    // 横向的视图
    horizontalViewPort (work) {
      return {
        height: 200,
        width: 200 / work.viewBox.height * work.viewBox.width
      }
    },
    // 横向的视图
    horizontalViewPortStyle (work) {
      return {
        height: '200px',
        width: 200 /work.viewBox.height * work.viewBox.width + 'px'
      }
    },

    // 横向的视图
    verticalViewPort (work) {
      return {
        height: 360,
        width: 360 / work.viewBox.height * work.viewBox.width
      }
    },
    // 横向的视图
    verticalViewPortStyle (work) {
      return {
        height: '360px',
        width: 360 / work.viewBox.height * work.viewBox.width + 'px'
      }
    },

    async loadWorks () {
      const result = await this.workdao.list(Object.assign({
        projection: 'updated,created,creator,name,id,frames,viewBox,title,author,avatar,color,snapshot,video',
        page: this.page,
        count: this.count
      }, this.listQuery()))
      this.works = result.list
      this.total = result.total
      this.loading = false
    },
  }
}
