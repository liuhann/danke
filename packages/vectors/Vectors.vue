<template>
<section id="vectors" class="section">
  <div class="container">
    <a class="file">
      <label class="file-label">
        <input class="file-input" type="file" name="resume" @input="svgFileChoosed">
        <span class="button is-primary">上传SVG</span>
      </label>
    </a>
    <form-edit-dialog :width="400" title="Edit Vector" ref="formEditDialog" @save="confirmVectorEdit"></form-edit-dialog>
    <div class="columns is-mobile is-multiline">
      <div class="column is-2-tablet is-one-third-mobile" v-for="(vector, index) in vectors" :key="index">
        <article class="media">
          <div class="media-left">
            <figure class="image is-48x48 figure-vector" :style="{
              maskImage: 'url(' + IMG_SERVER + '/' + vector.url + ')'
            }">
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">{{vector.name}}</p>
            <p class="subtitle is-6">{{vector.desc}}</p>
          </div>
        </article>
      </div>
    </div>
    <nav class="pagination is-rounded" role="navigation" aria-label="pagination">
      <a class="pagination-previous">上一页</a>
      <a class="pagination-next" @click="nextPage">下一页</a>
      <ul class="pagination-list">
        {{this.pageNumber}}
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
  components: {
    FormEditDialog
  },
  data () {
    return {
      IMG_SERVER: this.ctx.IMG_SERVER,
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
  mounted () {
    this.list()
  },
  methods: {
    async list () {
      this.vectors = (await this.vectordao.list({
        page: this.pageNumber,
        count: this.pageSize
      })).list
    },
    async nextPage () {
      this.pageNumber ++
      this.list()
    },

    async svgFileChoosed (e) {
      if (e.currentTarget.files.length) {
        const file = e.currentTarget.files[0]
        const result = await this.imagedao.uploadBlob(file, `vectors`)
        this.openVectorDialog({
          url: result.name,
          name: file.name,
          desc: ''
        })
      }
    },

    openVectorDialog (object) {
      this.$refs.formEditDialog.open(object)
    },

    async confirmVectorEdit (object) {
      if (object._id) {
        await this.vectordao.patch(object._id, object)
        await this.list()
      } else {
        this.vectordao.create(object)
        await this.list()
      }
    }
  }
}
</script>

<style>
.figure-vector {
  background-color: #00d1b2;
  mask-size: cover;
}
</style>
