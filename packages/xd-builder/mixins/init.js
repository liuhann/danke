import ImageDAO from '../../common/dao/imagedao'
import RestDAO from '../../common/dao/restdao'
export default {
  provide () {
    return { }
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.workdao = new RestDAO(this.ctx, 'danke/work')
    this.linkdao = new RestDAO(this.ctx, 'danke/link')
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
  }
}
