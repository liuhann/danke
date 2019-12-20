<template>
<section id="vectors" class="section">
  <div class="container">
    <a class="file">
      <label class="file-label">
        <input class="file-input" type="file" name="resume" @input="svgFileChoosed">
        <span class="button is-primary">上传SVG</span>
      </label>
    </a>
    <form-edit-dialog :width="400" :object="vectorObject" title="Edit Vector" ref="formEditDialog" @save="confirmVectorEdit"></form-edit-dialog>
    <rest-list rest="danke/vector" ref="restList">
      <template v-slot:item="{ item }">
        <article class="media">
          <div class="media-left">
            <figure class="image is-48x48 figure-vector" :style="{
              maskImage: 'url(' + IMG_SERVER + '/' + item.url + ')'
            }">
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">{{item.name}}</p>
            <p class="subtitle is-6">{{item.desc}}</p>
            <a @click="deleteVector">删除</a>
          </div>
        </article>
      </template>
    </rest-list>
  </div>
</section>
</template>

<script>
import ImageDAO from '../common/dao/imagedao'
import FormEditDialog from '../common/components/FormEditDialog'
import RestList from '../common/components/RestList'
import RestDAO from '../common/dao/restdao'

export default {
  name: 'Vectors.vue',
  components: {
    RestList,
    FormEditDialog
  },
  data () {
    return {
      IMG_SERVER: this.ctx.IMG_SERVER,
      vectorObject: {
        name: '',
        desc: '',
        url: ''
      }
    }
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.vectordao = new RestDAO(this.ctx, 'danke/vector')
  },
  mounted () {
  },
  methods: {
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

    deleteVector (v) {

    },

    async confirmVectorEdit (object) {
      if (object._id) {
        await this.vectordao.patch(object._id, object)
        this.$refs.restList.refresh()
      } else {
        this.vectordao.create(object)
        this.$refs.restList.refresh()
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
