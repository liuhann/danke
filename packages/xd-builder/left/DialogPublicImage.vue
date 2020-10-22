<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="50%"
  >
    <el-form label-width="80px">
      <el-form-item v-if="isEdit" label="标题">
        <el-input v-model="image.title" />
      </el-form-item>
      <el-form-item v-else label="标题">
        <div class="bold-title"> {{ image.title }}</div>
      </el-form-item>
      <el-form-item label="尺寸">
        <div class="bold-title"> {{ image.w }} x {{ image.h }}</div>
      </el-form-item>
      <el-form-item v-if="isEdit" label="标签">
        <el-select v-model="image.tags" multiple filterable allow-create>
          <el-option v-for="tag in presetTags" :key="tag" :label="tag" :value="tag"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-else label="标签">
        <el-tag v-for="tag in image.tags" :key="tag" type="success" @click="filterByTag(tag)">{{ tag }}</el-tag>
      </el-form-item>
      <el-form-item v-if="isEdit" label="操作">
        <el-button type="danger" size="mini" @click="remove">删除</el-button>
        <el-button type="success" size="mini" @click="update">更新</el-button>
        <span>
          <el-upload
            :auto-upload="false"
            action="none"
            accept="image/*"
            :show-file-list="false"
            class="upload-container"
            :on-change="(file, uploadFiles) => fileChoosed(file, uploadFiles)"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import ImageDAO from '../../utils/imagedao'
  import RestDAO from '../../utils/restdao'
  import getImageSize from '../../utils/imageSize'
  const presetTags = ['头像', '风景', '设计']

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
        presetTags,
        dialogVisible: false,
        isEdit: this.ctx.user.id === '15011245191'
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
      async update () {
        await this.restdao.update(this.image)
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
        this.$emit('delete', this.image)
      },
      closeDialog () {
        this.dialogVisible = false
        this.$emit('hide')
      },
      // may be choose multiple files, should do auto upload on choose
      // each file would trigger fileChoosed event
      async fileChoosed (file, uploadFiles) {
        const imageObject = {
          name: file.name,
          size: file.size,
        }
        let result = await this.imagedao.uploadBlob(file.raw, `public/images`, true)
        imageObject.url = result.name
        const size = await getImageSize(file.raw)
        imageObject.w = size.width
        imageObject.h = size.height
        // write file info
        await this.restdao.create(imageObject)
        this.closeDialog()
      },
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
.el-select {
  width: 100%;
}
.bold-title {
  font-size: 1.3rem;
}


</style>
