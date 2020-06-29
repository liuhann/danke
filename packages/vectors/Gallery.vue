<template>
<div class="gallery">
  <nav-bar/>
  <section class="section">
    <div class="container">
      <div class="tools">
        <el-upload :auto-upload="false" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false"
                   :on-change="fileChoosed">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <div class="tool-tags">
          <el-tag v-for="tag in tags" :key="tag" @click="changeTag(tag)" :type="currentTag===tag?'success':'info'">{{tag}}</el-tag>
        </div>
      </div>
      <form-edit-dialog :width="480" :options="formOptions" title="Edit Vector" ref="formEditDialog" @save="confirmVectorEdit"></form-edit-dialog>
      <rest-list rest="danke/vector" ref="restList" column="is-one-fifth-tablet is-one-third-mobile" :query="query">
        <template v-slot:item="{ item }">
          <div class="media">
            <div class="image" :class="item.url.endsWith('svg')? 'svg': ''">
              <img :src="getImageUrl(item.url)">
            </div>
            <div class="media-ops" v-if="item.creator === user">
              <el-button icon="el-icon-delete" @click="deleteVector(item)" type="text" size="mini"></el-button>
              <el-button icon="el-icon-edit" @click="editVector(item)" type="text"></el-button>
            </div>
            <div class="media-tags">
              <el-tag size="mini" v-for="tag in item.tags" :key="tag" type="warning">{{tag}}</el-tag>
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
import { Button, Upload, Message, Tag } from 'element-ui'
import ImageDAO from '../common/dao/imagedao'
import FormEditDialog from '../common/components/FormEditDialog'
import RestList from '../common/components/RestList'
import RestDAO from '../utils/restdao.js'

export default {
  name: 'Vectors.vue',
  components: {
    NavBar,
    [Button.name]: Button,
    [Tag.name]: Tag,
    [Upload.name]: Upload,
    RestList,
    FormEditDialog
  },
  data () {
    return {
      IMG_SERVER: this.ctx.IMG_SERVER,
      user: this.ctx.user ? this.ctx.user.id : 'anonymous',
      tags: [],
      currentTag: null,
      query: {},
      vectorObject: {
        name: '',
        desc: '',
        url: ''
      }
    }
  },
  computed: {
    formOptions () {
      return {
        tags: this.tags
      }
    }
  },
  created () {
    this.imagedao = new ImageDAO(this.ctx)
    this.vectordao = new RestDAO(this.ctx, 'danke/vector')
    this.loadTags()
  },
  mounted () {
  },
  methods: {
    async loadTags () {
      const tags = await this.vectordao.distinct('tags')
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
    },
    changeTag (tag) {
      this.currentTag = tag
      this.query = {
        tags: tag
      }
      this.$nextTick(() => {
        this.$refs.restList.refresh()
      })
    },
    editVector (object) {
      this.$refs.formEditDialog.open(object)
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

.tools {
  display: flex;
  padding: 10px 20px 20px 20px;
  .tool-tags {
    flex: 1;
    display: flex;
    flex-direction: row-reverse;
    .el-tag {
      margin-left: 5px;
      cursor: pointer;
      background: #fff;
    }
  }
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
    padding: 10px;
    &.svg {
      padding: 30px;
    }
  }
  .media-tags {
    position: absolute;
    bottom: 10px;
    left: 10px;
    .el-tag {
      margin-right: 5px;
    }
  }
  div.media-ops {
    position: absolute;
    bottom: 2px;
    right: 10px;
  }
}
</style>
