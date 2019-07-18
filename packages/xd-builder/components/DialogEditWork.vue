<template>
  <el-dialog
    width="480px"
    title="编辑作品信息"
    :visible.sync="dialogVisible">
    <div class="field has-addons">
      <p class="control">
        <a class="button is-static is-small">名称</a>
      </p>
      <p class="control" style="width: 100%;">
        <input class="input is-small" v-model="title">
      </p>
    </div>
    <div class="field has-addons">
      <p class="control">
        <a class="button is-static is-small">分类信息</a>
      </p>
      <p class="control" style="width: 100%;">
        <input class="input is-small" v-model="categories">
      </p>
    </div>
    <div class="field has-addons" style="height: 64px;">
      <p class="control">
        <a class="button is-static is-small">描述</a>
      </p>
      <p class="control" style="width: 100%; height: 64px;">
        <textarea class="input is-small" style="height: 64px;" v-model="desc"></textarea>
      </p>
    </div>


    <span slot="footer" class="dialog-footer">
    <a class="button is-small" @click="dialogVisible = false">
        取 消
    </a>
    <a class="button is-small is-primary" @click="saveWork">
        确 定
    </a>
  </span>
</el-dialog>
</template>

<script>
export default {
  name: 'DialogEditWork',
  data () {
    return {
      dialogVisible: false,
      title: '',
      categories: '',
      desc: ''
    }
  },
  methods: {
    open (work) {
      this.title = work.title
      this.categories = work.categories.join(' ')
      this.desc = work.desc
      this.dialogVisible = true
    },
    async saveWork () {
      this.$emit('save', {
        title: this.title,
        categories: this.categories.split(' '),
        desc: this.desc
      })
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>

</style>
