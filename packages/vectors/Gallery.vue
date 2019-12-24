<template>
<div class="gallery">
  <nav-bar/>
  <section class="section">
    <div class="container">
      <el-upload :auto-upload="false" action="https://jsonplaceholder.typicode.com/posts/"
        :on-change="fileChoosed">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <form-edit-dialog :width="400" :object="vectorObject" title="Edit Vector" ref="formEditDialog" @save="confirmVectorEdit"></form-edit-dialog>
      <rest-list rest="danke/vector" ref="restList" column="is-one-fifth-tablet is-one-third-mobile">
        <template v-slot:item="{ item }">
          <div class="media">
            <div class="image" :class="item.url.endsWith('svg')? 'svg': ''">
              <img :src="getImageUrl(item.url)">
            </div>
            <div class="media-content">
              <p class="">{{item.name}}</p>
              <a @click="deleteVector(item)">删除</a>
            </div>
          </div>
        </template>
      </rest-list>
    </div>
  </section>
</div>

</template>

<script>
import NavBar from '../site/components/NavBar'
import { Button, Upload, Message } from 'element-ui'
import ImageDAO from '../common/dao/imagedao'
import FormEditDialog from '../common/components/FormEditDialog'
import RestList from '../common/components/RestList'
import RestDAO from '../common/dao/restdao'

export default {
  name: 'Vectors.vue',
  components: {
    NavBar,
    [Button.name]: Button,
    [Upload.name]: Upload,
    RestList,
    FormEditDialog
  },
  data () {
    return {
      IMG_SERVER: this.ctx.IMG_SERVER,
      tags: [],
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
    async loadTags () {
      const tags = await this.restdao.distinct('tags')
      this.tags = tags
    },
    async fileChoosed (file) {
      const result = await this.imagedao.uploadBlob(file.raw, `gallery`)
      this.openVectorDialog({
        url: result.name,
        name: file.name,
        tags: [],
        desc: ''
      })
    },

    getImageUrl (url) {
      if (url.endsWith('.svg')) {
        return this.IMG_SERVER + '/' + url
      } else {
        return this.IMG_SERVER + '/' + url + '?x-oss-process=image/format,jpg/quality,Q_80/resize,m_fill,h_200,w_200'
      }
    },

    openVectorDialog (object) {
      this.$refs.formEditDialog.open(object)
    },

    async deleteVector (object) {
      await this.imagedao.removeBlob(object.url)
      await this.vectordao.delete(object)
      Message.success('图片删除完成')
      this.$refs.restList.refresh()
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

<style lang="scss">
.gallery {
  background: #f4f4f4;
}
.figure-vector {
  background-color: #00d1b2;
  mask-size: cover;
}

div.media {
  margin: 0 15px 30px 15px;
  padding-bottom:100%;
  background: #fff;
  border-radius: 2px;
  -webkit-box-shadow: 0 1px 2px rgba(0,0,0,0.07);
  box-shadow: 0 1px 2px rgba(0,0,0,0.07);
  overflow: hidden;
  height: 0;
  position: relative;
  div.image {
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    padding: 20px;
    &.svg {
      padding: 30px;
    }
  }
  div.media-content {
    position: absolute;
  }
}
</style>
