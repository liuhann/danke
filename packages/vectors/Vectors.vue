<template>
<section id="vectors" class="section">
  <div class="container">
    <a class="file">
      <label class="file-label">
        <input class="file-input" type="file" name="resume" @input="svgFileChoosed">
        <span class="button is-white icon-picture-1">
        </span>
      </label>
    </a>
    <form-edit-dialog :width="400" title="Edit Vector" ref="formEditDialog"></form-edit-dialog>
    <div class="columns is-mobile">
      <div class="column is-2-tablet is-one-third-mobile">

      </div>
    </div>
    <nav class="pagination is-rounded" role="navigation" aria-label="pagination">
      <a class="pagination-previous">Previous</a>
      <a class="pagination-next">Next page</a>
      <ul class="pagination-list">
        <li><a class="pagination-link" aria-label="Goto page 1">1</a></li>
        <li><span class="pagination-ellipsis">&hellip;</span></li>
        <li><a class="pagination-link" aria-label="Goto page 45">45</a></li>
        <li><a class="pagination-link is-current" aria-label="Page 46" aria-current="page">46</a></li>
        <li><a class="pagination-link" aria-label="Goto page 47">47</a></li>
        <li><span class="pagination-ellipsis">&hellip;</span></li>
        <li><a class="pagination-link" aria-label="Goto page 86">86</a></li>
      </ul>
    </nav>
  </div>
</section>
</template>

<script>
import RestDAO from '../common/dao/restdao'
import ImageDAO from '../common/dao/imagedao'
import FormEditDialog from '../common/components/FormEditDialog'

export default {
  name: 'Vectors.vue',
  components: [ FormEditDialog ],
  data () {
    return {
      pageSize: 20,
      pageNumber: 1,
      vectors: [],
      vectorObject: {
        name: '',
        desc: '',
        url: ''
      }
    }
  },
  created () {
    this.vectordao = new RestDAO(this.ctx, 'danke/vector')
    this.imagedao = new ImageDAO(this.ctx)
  },
  methods: {
    list () {
      this.vectordao.list({

      })
    },

    async svgFileChoosed (e) {
      if (e.currentTarget.files.length) {
        const file = e.currentTarget.files[0]
        const result = await this.imagedao.uploadBlob(file, `vectors`)
        this.vectorObject.url = result.name
        this.vectorObject.name = ''
        this.vectorObject.desc = ''
        this.$refs.formEditDialog.open(this.vectorObject)
      }
    }
  }
}
</script>

<style scoped>

</style>