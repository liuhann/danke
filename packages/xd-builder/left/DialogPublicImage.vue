<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%"
  >
    <el-form label-width="80px">
      <el-form-item label="标题">
        <div class="bold-title"> {{ image.title }}</div>
      </el-form-item>
      <el-form-item label="标签">
        <el-tag v-for="tag in image.tags" :key="tag" type="success" @click="filterByTag(tag)">{{ tag }}</el-tag>
      </el-form-item>
      <el-form-item label="操作">
        <el-button type="danger" size="mini" @click="remove">删除</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import ImageDAO from '../../utils/imagedao'
  import RestDAO from '../../utils/restdao'

  export default {
    name: 'DialogPublicImageVue',
    props: {
      image: {
        type: Object
      },
      resturl: {
        type: String
      }
    },
    data () {
      return {
        dialogVisible: false
      }
    },
    created () {
      this.imagedao = new ImageDAO(this.ctx)
      this.restdao = new RestDAO(this.ctx, this.resturl || 'danke/public/vector')
      this.vectordao = new RestDAO(this.ctx, 'danke/public/vector')
      this.deleteddao = new RestDAO(this.ctx, 'danke/public/deleted')
    },
    methods: {
      openDialog () {
        this.dialogVisible = true
        this.$emit('show')
      },
      filterByTag (tag) {
        this.dialogVisible = false
        this.$emit('filter', tag)
      },
      async remove () {
        if (this.image.url) {
          await this.imagedao.removeBlob(this.image.url)
        }
        await this.deleteddao.create({
          uid: this.image.uid,
          url: this.image.url
        })
        await this.restdao.delete(this.image)
        this.dialogVisible = false
      },
      closeDialog () {
        this.dialogVisible = false
        this.$emit('hide')
      }
    }
  }
</script>

<style scoped>
.el-tag {
  margin-right: 5px;
}
.el-form-item__label {
  color: #999;
}
.bold-title {
  font-weight: bold;
  font-size: 1.5rem;
}


</style>
