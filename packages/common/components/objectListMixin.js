import RestDAO from '../dao/restdao'
export default {
  data () {
    return {
      restPath: 'danke/clippath',
      objects: [],
      page: 0,
      pageSize: 20,
      total: 0
    }
  },
  computed: {
    filter () {
      return  {}
    }
  },
  created () {
    this.dao = new RestDAO(this.ctx, this.restPath)
  },
  mounted () {
    this.loadObjects()
  },
  methods: {
    async loadObjects () {
      const result = await this.dao.list(Object.assign({
        page: this.page,
        count: this.pageSize,
      }, this.filter))
      this.total = result.total
      this.objects = result.list
      this.objectUpdated()
    },
    objectUpdated () { },
    variableStyle (object) {
      const styles = {}
      if (object.variables) {
        for (let variable of object.variables) {
          Object.assign(styles, {
            [`--${variable.name}`]: variable.value
          })
        }
      }
      return styles
    },
    async remove (style) {
      if (window.confirm('确认删除')) {
        await this.dao.delete(style)
        this.loadObjects()
      }
    }
  }
}
