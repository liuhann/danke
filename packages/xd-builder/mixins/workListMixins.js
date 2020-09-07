import RestDAO from '../../utils/restdao.js'
import StyleRegistry from '../utils/StyleRegistry'
import { fitRectIntoBounds } from './rectUtils'

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
        width: 360 /work.viewBox.height * work.viewBox.width + 'px'
      }
    },

    async loadWorks () {
      const result = await this.workdao.list(Object.assign({
        projection: 'scenes.1,updated,created,creator,name,id,frames,viewBox,title,author,avatar,color',
        page: this.page,
        count: this.count
      }, this.listQuery()))

      const svgs = []
      for (let work of result.list) {
        work.scenes[0].elements.forEach( element=> {
          if (element.svg) {
            svgs.push(element.svg)
          }
        })
        work.stage = 'enter'
        if (work.frames) {
          this.ctx.styleRegistry.addFrames(work.frames)
        }
        work.viewport = fitRectIntoBounds(work.viewBox || work.screen || {
          width: 200,
          height: 150
        }, this.viewport())
      }
      // const svgRes = await this.svgdao.multiGet(svgs)
      // for (let res of svgRes.list) {
      //   this.ctx.styleRegistry.addVector(res)
      // }

      this.works = result.list
      this.total = result.total
      this.loading = false
    },
  }
}
